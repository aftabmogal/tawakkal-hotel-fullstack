from rest_framework import serializers

from .models import User, phone_validator


class UserSerializer(serializers.ModelSerializer):
    booking_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'is_staff', 'date_joined', 'booking_count']
        read_only_fields = ['id', 'phone', 'is_staff', 'date_joined', 'booking_count']

    def get_booking_count(self, obj):
        return obj.bookings.count()


class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[phone_validator])


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[phone_validator])
    code = serializers.RegexField(
        regex=r'^\d{6}$', error_messages={'invalid': 'Enter the 6-digit code.'}
    )
