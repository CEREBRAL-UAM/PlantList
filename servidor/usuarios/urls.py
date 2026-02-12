from django.urls import path
from .views import RegistroView, LoginView , UsuarioActualView, LogoutView, CambioContrasenaView

urlpatterns = [
    path('apiv1/registro/', RegistroView.as_view()),
    path('apiv1/login/', LoginView.as_view()),
    path('apiv1/actual/', UsuarioActualView.as_view(), name='usuario-actual'),
    path('apiv1/logout/', LogoutView.as_view(), name='logout'),
    path('apiv1/cambiarContrasena/', CambioContrasenaView.as_view()),
]