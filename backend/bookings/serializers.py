from django.utils import timezone
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'room', 'room_name', 'guest_name', 'guest_email',
            'guest_phone', 'check_in', 'check_out', 'adults', 'children',
            'special_requests', 'nights', 'price_per_night', 'total_amount',
            'booking_status', 'payment_status', 'created_at',
        ]
        read_only_fields = [
            'id', 'booking_id', 'room_name', 'nights', 'price_per_night',
            'total_amount', 'booking_status', 'payment_status', 'created_at',
        ]

    def validate(self, attrs):
        room = attrs.get('room') or getattr(self.instance, 'room', None)
        check_in = attrs.get('check_in') or getattr(self.instance, 'check_in', None)
        check_out = attrs.get('check_out') or getattr(self.instance, 'check_out', None)

        if check_out <= check_in:
            raise serializers.ValidationError({'check_out': 'Must be after check-in.'})
        if check_in < timezone.now().date():
            raise serializers.ValidationError({'check_in': 'Cannot be in the past.'})

        overlapping = Booking.objects.filter(
            room=room, booking_status='Confirmed',
            check_in__lt=check_out, check_out__gt=check_in,
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError(
                'This room is not available for the selected dates.'
            )

        adults = attrs.get('adults', getattr(self.instance, 'adults', 1))
        children = attrs.get('children', getattr(self.instance, 'children', 0))
        if room and adults + children > room.guests:
            raise serializers.ValidationError(
                {'adults': f'This room fits up to {room.guests} guests.'}
            )

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        room = validated_data['room']
        validated_data['price_per_night'] = room.price_per_night
        validated_data.setdefault('guest_phone', request.user.phone)
        return Booking.objects.create(user=request.user, **validated_data)


class AdminBookingSerializer(BookingSerializer):
    """Same as BookingSerializer but lets staff edit status fields directly."""

    class Meta(BookingSerializer.Meta):
        read_only_fields = [
            f for f in BookingSerializer.Meta.read_only_fields
            if f not in ('booking_status', 'payment_status')
        ]
