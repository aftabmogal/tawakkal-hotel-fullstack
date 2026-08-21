import random
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

from .managers import UserManager

phone_validator = RegexValidator(
    regex=r'^[6-9]\d{9}$', message='Enter a valid 10-digit Indian mobile number.'
)


class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(
        max_length=10, unique=True, db_index=True, validators=[phone_validator]
    )
    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name or self.phone


def _default_otp_expiry():
    minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 5)
    return timezone.now() + timedelta(minutes=minutes)


class PhoneOTP(models.Model):
    phone = models.CharField(max_length=10, db_index=True, validators=[phone_validator])
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=_default_otp_expiry)
    is_consumed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        return not self.is_consumed and timezone.now() < self.expires_at

    @staticmethod
    def generate_code():
        return f'{random.randint(0, 999999):06d}'

    def __str__(self):
        return f'{self.phone} · {self.code}'
