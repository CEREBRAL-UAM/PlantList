from rest_framework import viewsets
from .serializer import (PlantaSerializer, EspecieSerializer, PartePlantaSerializer, PlantaPartesSerializer)
from .models import Planta, Especie, PartePlanta, PlantaPartes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
class PlantaView(viewsets.ModelViewSet):
    serializer_class = PlantaSerializer
    queryset = Planta.objects.all()

class EspecieView(viewsets.ModelViewSet):
    serializer_class = EspecieSerializer
    queryset = Especie.objects.all()

class PartePlantaView(viewsets.ModelViewSet):
    serializer_class = PartePlantaSerializer
    queryset = PartePlanta.objects.all()

class PlantaPartesViewSet(viewsets.ModelViewSet):
    queryset = PlantaPartes.objects.all()
    serializer_class = PlantaPartesSerializer


# Para obtener plantas de un usuario especifico (autenticado)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def obtener_plantas_usuario(request):
    plantas = Planta.objects.filter(usuario=request.user)  # Filtra las plantas del usuario
    serializer = PlantaSerializer(plantas, many=True)
    return Response(serializer.data)