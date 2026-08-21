from rest_framework import serializers

from .models import FoodItem, RestaurantCategory


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'category', 'name', 'price', 'is_veg', 'is_available']


class RestaurantCategorySerializer(serializers.ModelSerializer):
    items = FoodItemSerializer(many=True, read_only=True)

    class Meta:
        model = RestaurantCategory
        fields = ['id', 'name', 'order', 'items']
