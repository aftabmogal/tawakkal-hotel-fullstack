from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from hotel.views import IsAdminOrReadOnly

from .models import FoodItem, RestaurantCategory
from .serializers import FoodItemSerializer, RestaurantCategorySerializer


class RestaurantCategoryViewSet(viewsets.ModelViewSet):
    queryset = RestaurantCategory.objects.prefetch_related('items')
    serializer_class = RestaurantCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_available', 'is_veg']
