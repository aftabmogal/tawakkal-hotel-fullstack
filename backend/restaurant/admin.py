from django.contrib import admin

from .models import FoodItem, RestaurantCategory


class FoodItemInline(admin.TabularInline):
    model = FoodItem
    extra = 1


@admin.register(RestaurantCategory)
class RestaurantCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    inlines = [FoodItemInline]


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_veg', 'is_available']
    list_filter = ['category', 'is_veg', 'is_available']
    search_fields = ['name']
