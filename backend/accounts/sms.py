import logging

logger = logging.getLogger(__name__)


def send_sms_otp(phone: str, code: str) -> None:
    """
    Stub SMS backend. No real SMS provider is wired up yet, so this just
    logs the OTP so the flow is testable end-to-end in development.

    To go live, swap the body of this function for a call to a real
    provider (e.g. MSG91, Twilio, AWS SNS), reading credentials from
    environment variables — never hardcode them here.
    """
    message = f'[DEV OTP] {code} is your Tawakkal Hotel verification code for +91{phone}'
    logger.info(message)
    print(message)
