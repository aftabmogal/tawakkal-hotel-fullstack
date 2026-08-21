from django.contrib import admin

from .models import Booking, Payment


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'guest_name', 'room', 'check_in', 'check_out',
        'total_amount', 'booking_status', 'payment_status', 'created_at',
    ]
    list_filter = ['booking_status', 'payment_status', 'room']
    search_fields = ['booking_id', 'guest_name', 'guest_email', 'guest_phone']
    readonly_fields = ['booking_id', 'nights', 'total_amount', 'created_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['booking', 'amount', 'status', 'created_at']
    list_filter = ['status']
