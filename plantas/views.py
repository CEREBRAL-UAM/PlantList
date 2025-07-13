from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from .serializer import (PlantaSerializer, EspecieSerializer, PartePlantaSerializer,
                          PlantaPartesSerializer, EspacioSerializer, CrearEspacioSerializer, EspaciosUsuariosSerializer)
from .models import Planta, Especie, PartePlanta, PlantaPartes, Espacio, EspaciosUsuarios
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from usuarios.models import Usuario
from usuarios.serializers import UsuarioDatosSerializer 
from usuarios.models import TokenUsuario
from .utils import generar_clave_acceso_unica

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

class EspaciosUsuariosViewSet(viewsets.ModelViewSet):
    queryset = EspaciosUsuarios.objects.all()
    serializer_class = EspaciosUsuariosSerializer

class EspacioViewSet(viewsets.ModelViewSet):
    queryset = Espacio.objects.all()
    serializer_class = EspacioSerializer

class ColaboradoresEspacio(APIView):
    def get(self, request): 
        id_espacios = request.query_params.get('id_espacios')
        is_admin = request.query_params.get('isAdmin')
        try: 
            espacio = Espacio.objects.get(id_espacios=id_espacios)
        except Espacio.DoesNotExist:
            return Response({'error':'Espacio no encontrado'},status=404)

        is_admin = True if is_admin == '1' else False
        relaciones = EspaciosUsuarios.objects.filter(id_espacios=espacio, isAdmin=is_admin)

        usuarios_admin = [rel.id_usuario for rel in relaciones]

        serializer = UsuarioDatosSerializer(usuarios_admin, many=True) 
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class EspaciosPorUsuarioView(APIView):
    def get(self, request):
        token_str = request.headers.get('Authorization', '').replace('Token ', '')

        try:
            token_obj = TokenUsuario.objects.get(token=token_str)
        except TokenUsuario.DoesNotExist:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        
        usuario = token_obj.usuario
        espacios = Espacio.objects.filter(usuarios_miembros=usuario)

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
            espacio = serializer.save()  
            espacio.clave_acceso = generar_clave_acceso_unica()
            espacio.save()
            EspaciosUsuarios.objects.create(
                id_usuario=usuario,
                id_espacios=espacio,
                isAdmin=True
            )
            return Response({'mensaje': 'Espacio creado exitosamente', 'id': espacio.id_espacios}, status=201)
        return Response(serializer.errors, status=400)