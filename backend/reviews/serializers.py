from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    guest_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'guest_name', 'rating', 'comment', 'is_approved', 'created_at']
        read_only_fields = ['id', 'guest_name', 'is_approved', 'created_at']
