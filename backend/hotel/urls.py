from rest_framework.routers import DefaultRouter

from .views import FacilityViewSet, RoomImageViewSet, RoomViewSet

router = DefaultRouter()
router.register('rooms', RoomViewSet, basename='room')
router.register('room-images', RoomImageViewSet, basename='room-image')
router.register('facilities', FacilityViewSet, basename='facility')

urlpatterns = router.urls
