from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SensadoAmbientalViewSet, SensadoSueloViewSet, SensadoContaminantesViewSet

router = DefaultRouter()
router.register(r'sensadoambiental', SensadoAmbientalViewSet)
router.register(r'sensadosuelo', SensadoSueloViewSet)
router.register(r'sensadocontaminantes', SensadoContaminantesViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
