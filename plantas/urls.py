from django.urls import path, include
from rest_framework import routers
from plantas import views

router = routers.DefaultRouter()
router.register(r'plantas', views.PlantaView, 'plantas')
router.register(r'especies', views.EspecieView, 'especies')
router.register(r'enfermedades', views.EnfermedadView, 'enfermedades')
router.register(r'plagas', views.PlagaView, 'plagas')

urlpatterns = [
    path('apiv1/usuario/', views.obtener_plantas_usuario, name='obtener_plantas_usuario'),
    path("apiv1/",include(router.urls))
]