import razorpay as razorpay_sdk
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Booking, Payment
from .permissions import IsOwnerOrAdmin
from .razorpay_client import get_razorpay_client
from .serializers import AdminBookingSerializer, BookingSerializer
from django.conf import settings


class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filterset_fields = ['booking_status', 'payment_status', 'room', 'user']

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return AdminBookingSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        booking = serializer.save()
        from notifications.emails import send_booking_confirmation
        send_booking_confirmation(booking)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.booking_status != 'Confirmed':
            return Response(
                {'detail': 'Only confirmed bookings can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.booking_status = 'Cancelled'
        booking.save(update_fields=['booking_status'])
        # TODO: send a cancellation email once an SMTP backend is configured
        # (see notifications.send_booking_cancelled).
        from notifications.emails import send_booking_cancelled
        send_booking_cancelled(booking)
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], url_path='create-order')
    def create_order(self, request, pk=None):
        """Creates a Razorpay order for this booking's total amount."""
        booking = self.get_object()
        if booking.booking_status != 'Confirmed':
            return Response({'detail': 'Only confirmed bookings can be paid.'}, status=400)
        if booking.payment_status == 'Paid':
            return Response({'detail': 'This booking is already paid.'}, status=400)

        client = get_razorpay_client()
        order = client.order.create({
            'amount': int(booking.total_amount * 100),  # paise
            'currency': 'INR',
            'receipt': booking.booking_id,
            'notes': {'booking_id': booking.booking_id},
        })

        payment, _ = Payment.objects.update_or_create(
            booking=booking,
            defaults={
                'razorpay_order_id': order['id'],
                'amount': booking.total_amount,
                'status': 'created',
            },
        )

        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key_id': settings.RAZORPAY_KEY_ID,
            'booking_id': booking.booking_id,
        })

    @action(detail=True, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request, pk=None):
        """Verifies the Razorpay signature and marks the booking as paid."""
        booking = self.get_object()
        payment = getattr(booking, 'payment', None)
        if not payment or not payment.razorpay_order_id:
            return Response({'detail': 'No payment order found for this booking.'}, status=400)

        params = {
            'razorpay_order_id': request.data.get('razorpay_order_id'),
            'razorpay_payment_id': request.data.get('razorpay_payment_id'),
            'razorpay_signature': request.data.get('razorpay_signature'),
        }
        if not all(params.values()):
            return Response({'detail': 'Missing payment verification fields.'}, status=400)

        client = get_razorpay_client()
        try:
            client.utility.verify_payment_signature(params)
        except razorpay_sdk.errors.SignatureVerificationError:
            payment.status = 'failed'
            payment.save(update_fields=['status'])
            return Response({'detail': 'Payment verification failed.'}, status=400)

        payment.razorpay_payment_id = params['razorpay_payment_id']
        payment.razorpay_signature = params['razorpay_signature']
        payment.status = 'paid'
        payment.save()

        booking.payment_status = 'Paid'
        booking.save(update_fields=['payment_status'])

        return Response(self.get_serializer(booking).data)
