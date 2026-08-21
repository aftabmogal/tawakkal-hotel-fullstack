import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from hotel.models import Room


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Pay at Hotel', 'Pay at Hotel'),
        ('Paid', 'Paid'),
        ('Refunded', 'Refunded'),
    ]

    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='bookings', on_delete=models.CASCADE
    )
    room = models.ForeignKey(Room, related_name='bookings', on_delete=models.PROTECT)

    guest_name = models.CharField(max_length=150)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=10)

    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.PositiveSmallIntegerField(default=1)
    children = models.PositiveSmallIntegerField(default=0)
    special_requests = models.TextField(blank=True)

    nights = models.PositiveSmallIntegerField(editable=False, default=0)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    total_amount = models.DecimalField(max_digits=9, decimal_places=2, editable=False, default=0)

    booking_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pay at Hotel'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        if self.check_out and self.check_in and self.check_out <= self.check_in:
            raise ValidationError('Check-out must be after check-in.')

        if self.room_id and self.check_in and self.check_out:
            overlapping = Booking.objects.filter(
                room_id=self.room_id,
                booking_status='Confirmed',
                check_in__lt=self.check_out,
                check_out__gt=self.check_in,
            ).exclude(pk=self.pk)
            if overlapping.exists():
                raise ValidationError('This room is already booked for the selected dates.')

    def save(self, *args, **kwargs):
        if self.check_in and self.check_out:
            self.nights = (self.check_out - self.check_in).days
            self.total_amount = self.nights * self.price_per_night
        if not self.booking_id:
            self.booking_id = f'TWK-{uuid.uuid4().hex[:6].upper()}'
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_id


class Payment(models.Model):
    """
    Architecture for a future Razorpay integration. Not wired to a live
    payment flow yet — bookings currently default to 'Pay at Hotel'.
    """

    STATUS_CHOICES = [
        ('created', 'Created'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    booking = models.OneToOneField(Booking, related_name='payment', on_delete=models.CASCADE)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=9, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Payment for {self.booking.booking_id}'
