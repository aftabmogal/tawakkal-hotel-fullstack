from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import Facility, Room, RoomImage
from .serializers import FacilitySerializer, RoomImageWriteSerializer, RoomSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """Anyone can read; only staff (admin panel users) can write."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().prefetch_related('images')
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['room_type', 'is_available', 'guests']
    ordering_fields = ['price_per_night', 'guests']

    def get_serializer_context(self):
        return {'request': self.request}


class RoomImageViewSet(viewsets.ModelViewSet):
    """Admin-only: add/remove room photos by URL (see hotel/admin.py for file uploads)."""

    queryset = RoomImage.objects.all()
    serializer_class = RoomImageWriteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['room']


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
