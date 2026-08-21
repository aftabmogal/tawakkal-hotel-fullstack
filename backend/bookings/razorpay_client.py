import razorpay
from django.conf import settings
from rest_framework.exceptions import APIException


class PaymentGatewayNotConfigured(APIException):
    status_code = 503
    default_detail = 'Online payments are not configured yet. Please pay at the hotel.'
    default_code = 'payment_gateway_not_configured'


def get_razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise PaymentGatewayNotConfigured()
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
