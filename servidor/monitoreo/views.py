from rest_framework import viewsets
from rest_framework import generics
from .models import SensadoAmbiental,  sensadoSuelo, SensadoContaminantes
from .serializers import SensadoAmbientalSerializer, SensadoSueloSerializer, SensadoContaminantesSerializer

class SensadoSueloViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = sensadoSuelo.objects.all().order_by('-fechaSensado')
    serializer_class = SensadoSueloSerializer

class SensadoAmbientalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensadoAmbiental.objects.all().order_by('-FechaSensado')[:100]
    serializer_class = SensadoAmbientalSerializer

class SensadoContaminantesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensadoContaminantes.objects.all().order_by('-fechaSensado')
    serializer_class = SensadoContaminantesSerializer

class SensadoContaminantesListAPIView(generics.ListAPIView):
    queryset = SensadoContaminantes.objects.select_related('circuito').all()
    serializer_class = SensadoContaminantesSerializer