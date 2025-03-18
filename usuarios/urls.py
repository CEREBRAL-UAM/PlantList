from django.urls import path, include
from rest_framework import routers
from usuarios import views

router = routers.DefaultRouter()
router.register(r'usuarios', views.UsuarioView, 'usuarios')

urlpatterns = [
    path("usuarios/apiv1/",include(router.urls))
]