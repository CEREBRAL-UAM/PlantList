from django.urls import path, include
from rest_framework.routers import DefaultRouter

from monitoreo.views import (
    # Ambientales
    SensadoAmbientalViewSet,
    HistoricosAmbientalesFacets,
    DatosAmbientalesView,

    # Suelo
    SensadoSueloViewSet,
    HistoricosSueloFacets,
    DatosSueloView,

    # Contaminantes
    SensadoContaminantesViewSet,
    ContaminantesFacetsView,
)

router = DefaultRouter()

router.register(
    r'sensadoambiental',
    SensadoAmbientalViewSet,
    basename='sensadoambiental'
)

router.register(
    r'sensadosuelo',
    SensadoSueloViewSet,
    basename='sensadosuelo'
)

router.register(
    r'sensadocontaminantes',
    SensadoContaminantesViewSet,
    basename='sensadocontaminantes'
)

urlpatterns = [
    path('', include(router.urls)),
    path('historicos/facets/', HistoricosAmbientalesFacets.as_view(), name='historicos-ambientales-facets'),
    path('ambiental/', DatosAmbientalesView.as_view(), name='ambiental-list'),

    path('suelo/facets/', HistoricosSueloFacets.as_view(), name='historicos-suelo-facets'),
    path("suelo/", DatosSueloView.as_view(), name="suelo-list"),

    path('contaminantes/facets/', ContaminantesFacetsView.as_view(), name='contaminantes-facets'),
]
