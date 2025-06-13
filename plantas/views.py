from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from .serializer import (PlantaSerializer, EspecieSerializer, PartePlantaSerializer,
                          PlantaPartesSerializer, EspacioSerializer, CrearEspacioSerializer)
from .models import Planta, Especie, PartePlanta, PlantaPartes, Espacio
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from usuarios.models import TokenUsuario

# Create your views here.
class PlantaView(viewsets.ModelViewSet):
    serializer_class = PlantaSerializer
    queryset = Planta.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        id_espacios = self.request.query_params.get("id_espacios")
        if id_espacios:
            queryset = queryset.filter(id_espacios=id_espacios)
        return queryset

class EspecieView(viewsets.ModelViewSet):
    serializer_class = EspecieSerializer
    queryset = Especie.objects.all()

class PartePlantaView(viewsets.ModelViewSet):
    serializer_class = PartePlantaSerializer
    queryset = PartePlanta.objects.all()

class PlantaPartesViewSet(viewsets.ModelViewSet):
    queryset = PlantaPartes.objects.all()
    serializer_class = PlantaPartesSerializer

class EspacioViewSet(viewsets.ModelViewSet):
    queryset = Espacio.objects.all()
    serializer_class = EspacioSerializer

class EspaciosPorUsuarioView(APIView):
    def get(self, request):
        token_str = request.headers.get('Authorization', '').replace('Token ', '')

        try:
            token_obj = TokenUsuario.objects.get(token=token_str)
        except TokenUsuario.DoesNotExist:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        
        usuario = token_obj.usuario
        espacios = Espacio.objects.filter(id_usuario=usuario)
        serializer = EspacioSerializer(espacios, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class CrearEspacioUsuarioView(APIView):
    def post(self, request):
        token_str = request.headers.get('Authorization', '').replace('Token ', '')

        try:
            token_obj = TokenUsuario.objects.get(token=token_str)
        except TokenUsuario.DoesNotExist:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)

        usuario = token_obj.usuario

        serializer = CrearEspacioSerializer(data=request.data)
        if serializer.is_valid():
            espacio = serializer.save(id_usuario=usuario)  # aquí se asocia automáticamente
            return Response({'mensaje': 'Espacio creado exitosamente', 'id': espacio.id_espacios}, status=201)
        return Response(serializer.errors, status=400)