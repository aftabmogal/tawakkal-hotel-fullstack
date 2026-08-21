from django.db.models import Sum
from django.utils import timezone
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from bookings.models import Booking
from contact.models import ContactMessage
from hotel.models import Room


class DashboardStatsView(APIView):
    """GET /api/dashboard/stats/ — summary numbers for the admin home screen."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()

        total_rooms = Room.objects.count()
        occupied_room_ids = Booking.objects.filter(
            booking_status='Confirmed', check_in__lte=today, check_out__gt=today
        ).values_list('room_id', flat=True).distinct()
        occupied_rooms = len(occupied_room_ids)

        revenue = Booking.objects.filter(
            booking_status__in=['Confirmed', 'Completed']
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        recent_bookings = Booking.objects.select_related('room').order_by('-created_at')[:5]

        data = {
            'total_bookings': Booking.objects.count(),
            'todays_bookings': Booking.objects.filter(created_at__date=today).count(),
            'total_rooms': total_rooms,
            'available_rooms': max(total_rooms - occupied_rooms, 0),
            'occupied_rooms': occupied_rooms,
            'total_customers': User.objects.filter(is_staff=False).count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'revenue': revenue,
            'recent_bookings': [
                {
                    'booking_id': b.booking_id,
                    'room': b.room.name,
                    'guest_name': b.guest_name,
                    'check_in': b.check_in,
                    'check_out': b.check_out,
                    'total_amount': b.total_amount,
                    'booking_status': b.booking_status,
                }
                for b in recent_bookings
            ],
        }
        return Response(data)
