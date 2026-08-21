from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PhoneOTP, User
from .serializers import SendOTPSerializer, UserSerializer, VerifyOTPSerializer
from .sms import send_sms_otp


class SendOTPView(APIView):
    """POST /api/auth/otp/send/ — generates and 'sends' a 6-digit OTP."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        code = PhoneOTP.generate_code()
        PhoneOTP.objects.create(phone=phone, code=code)
        send_sms_otp(phone, code)

        return Response({'detail': 'OTP sent.'}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    POST /api/auth/otp/verify/ — verifies the code, creates the user on
    first sign-in, and returns JWT access/refresh tokens.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']

        otp = PhoneOTP.objects.filter(phone=phone, code=code).first()
        if not otp or not otp.is_valid():
            return Response(
                {'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST
            )

        otp.is_consumed = True
        otp.save(update_fields=['is_consumed'])

        user, created = User.objects.get_or_create(phone=phone)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'is_new_user': created,
            }
        )


class MeView(APIView):
    """GET/PATCH /api/auth/me/ — the signed-in user's own profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CustomerListView(ListAPIView):
    """GET /api/auth/users/ — admin-only list of registered guests."""

    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    filterset_fields = []

    def get_queryset(self):
        return User.objects.filter(is_staff=False).order_by('-date_joined')
