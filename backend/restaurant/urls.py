from rest_framework.routers import DefaultRouter

from .views import FoodItemViewSet, RestaurantCategoryViewSet

router = DefaultRouter()
router.register('categories', RestaurantCategoryViewSet, basename='restaurant-category')
router.register('items', FoodItemViewSet, basename='food-item')

urlpatterns = router.urls
