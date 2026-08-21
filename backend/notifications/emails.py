import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def _send(subject, message, to_email):
    if not to_email:
        return
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
    except Exception:
        # Email is a nice-to-have, not a booking blocker — log and move on
        # rather than surfacing a 500 to the guest.
        logger.exception('Failed to send email to %s', to_email)


def send_booking_confirmation(booking):
    """
    Sent once a booking is confirmed (and, if paid online, once payment is
    verified). Uses Django's console email backend in dev — see
    config/settings.py EMAIL_* settings to switch to real SMTP.
    """
    subject = f'Booking Confirmed — {booking.booking_id}'
    message = (
        f'Hi {booking.guest_name},\n\n'
        f'Your booking at Tawakkal Restaurant & Hotel is confirmed.\n\n'
        f'Booking ID: {booking.booking_id}\n'
        f'Room: {booking.room.name}\n'
        f'Check-in: {booking.check_in}\n'
        f'Check-out: {booking.check_out}\n'
        f'Guests: {booking.adults} adult(s), {booking.children} child(ren)\n'
        f'Total amount: ₹{booking.total_amount}\n'
        f'Payment status: {booking.payment_status}\n\n'
        f'Hotel contact: {settings.HOTEL_CONTACT_PHONE}\n'
        f'{settings.HOTEL_CONTACT_ADDRESS}\n\n'
        f'We look forward to hosting you.\n— Tawakkal Restaurant & Hotel'
    )
    _send(subject, message, booking.guest_email)


def send_booking_cancelled(booking):
    subject = f'Booking Cancelled — {booking.booking_id}'
    message = (
        f'Hi {booking.guest_name},\n\n'
        f'Your booking {booking.booking_id} for {booking.room.name} '
        f'({booking.check_in} to {booking.check_out}) has been cancelled.\n\n'
        f'If this wasn\'t you, please call us at {settings.HOTEL_CONTACT_PHONE}.\n\n'
        f'— Tawakkal Restaurant & Hotel'
    )
    _send(subject, message, booking.guest_email)
