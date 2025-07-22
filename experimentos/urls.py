from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
router.register(r'tipoestimulacion', TipoEstimulacionView)
router.register(r'material', MaterialView)
router.register(r'electrodos', ElectrodosView)
router.register(r'ubicaciones', UbicacionesView)
router.register(r'suelo', SueloView)
router.register(r'etapadesarrollo', EtapaDesarrolloView)
router.register(r'origencrianza', OrigenCrianzaView)
router.register(r'plagas', PlagasView)
router.register(r'plantaindividuo', PlantaIndividuoView)

urlpatterns = [
    path('', include(router.urls)),
]
