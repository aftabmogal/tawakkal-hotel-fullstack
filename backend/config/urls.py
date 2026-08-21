from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('accounts.urls')),
    path('api/', include('hotel.urls')),  # -> /api/rooms/, /api/facilities/
    path('api/bookings/', include('bookings.urls')),
    path('api/restaurant/', include('restaurant.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
