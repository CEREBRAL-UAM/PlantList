from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from django.conf import settings
from django.conf.urls.static import static  


urlpatterns = [
    path('admin/', admin.site.urls),
    path('plantas/', include('plantas.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/monitoreo/', include('monitoreo.urls')),
    path('api/experimentos/', include('experimentos.urls')),

    path('usuarios/', include('usuarios.urls')),

    # Interfaz Swagger para visualizar la API
    path('doc/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Interfaz Redoc (otra forma de ver la documentación)
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)