from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SensadoAmbientalViewSet

router = DefaultRouter()
router.register(r'sensadoambiental', SensadoAmbientalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
