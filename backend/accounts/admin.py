from django.contrib import admin

from .models import PhoneOTP, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['phone', 'name', 'email', 'is_staff', 'is_active', 'date_joined']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['phone', 'name', 'email']
    ordering = ['-date_joined']


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    list_display = ['phone', 'code', 'created_at', 'expires_at', 'is_consumed']
    list_filter = ['is_consumed']
    search_fields = ['phone']
