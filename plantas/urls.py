from django.urls import path, include
from rest_framework import routers
from plantas import views

router = routers.DefaultRouter()
router.register(r'plantas', views.PlantaView, 'plantas')
router.register(r'especies', views.EspecieView, 'especies')
router.register(r'parte_planta', views.PartePlantaView, 'parte_planta')
router.register(r'planta_partes', views.PlantaPartesViewSet, 'planta_partes')
router.register(r'espacios', views.EspacioViewSet, 'espacios')

urlpatterns = [
    path("apiv1/espacios/mis_espacios/", views.EspaciosPorUsuarioView.as_view(), name='mis_espacios'),
    path("apiv1/espacios/crear_espacio/", views.CrearEspacioUsuarioView.as_view(), name='crear_espacio'),
    path("apiv1/",include(router.urls)),
]