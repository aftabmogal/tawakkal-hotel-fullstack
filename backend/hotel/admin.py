from django.contrib import admin

from .models import Facility, Room, RoomImage


class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'room_type', 'price_per_night', 'guests', 'is_available']
    list_filter = ['room_type', 'is_available']
    search_fields = ['name']
    inlines = [RoomImageInline]


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'icon', 'description']
    list_filter = ['category']
