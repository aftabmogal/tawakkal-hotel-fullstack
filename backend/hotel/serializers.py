from rest_framework import serializers

from .models import Facility, Room, RoomImage


class RoomImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'alt_text', 'order']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url or None


class RoomImageWriteSerializer(serializers.ModelSerializer):
    """Used by the admin dashboard to add/remove images by URL."""

    class Meta:
        model = RoomImage
        fields = ['id', 'room', 'image_url', 'alt_text', 'order']


class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'name', 'room_type', 'description', 'guests', 'bed_type', 'size',
            'price_per_night', 'amenities', 'is_available', 'cover_image', 'images',
            'created_at',
        ]

    def get_cover_image(self, obj):
        first = obj.images.first()
        if not first:
            return None
        return RoomImageSerializer(first, context=self.context).data['image']


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'icon', 'description', 'category']
