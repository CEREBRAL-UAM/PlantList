from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Usuario, TokenUsuario
import uuid
from .serializers import (
    UsuarioRegistroSerializer, UsuarioLoginSerializer, UsuarioDatosSerializer
)
from django.contrib.auth.hashers import check_password
from .authentication import TokenAuthentication


class RegistroView(APIView):
    serializer_class = UsuarioRegistroSerializer
    queryset = Usuario.objects.all()

    def post(self, request):
        serializer = UsuarioRegistroSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            # Crear un token único
            token = str(uuid.uuid4())
            TokenUsuario.objects.create(usuario=usuario, token=token)
            return Response({'token': token}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    serializer_class = UsuarioLoginSerializer
    
    def post(self, request):
        serializer = UsuarioLoginSerializer(data=request.data)
        if serializer.is_valid():
            correo = serializer.validated_data['CorreoElectronico']
            contrasenia = serializer.validated_data['Contrasenia']

            try:
                usuario = Usuario.objects.get(CorreoElectronico=correo)
            except Usuario.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

            if check_password(contrasenia, usuario.Contrasenia):
                # Reutiliza o genera nuevo token
                token_obj, created = TokenUsuario.objects.get_or_create(usuario=usuario)
                if not created:
                    token_obj.token = str(uuid.uuid4())
                    token_obj.save()
                return Response({'token': token_obj.token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        token = request.headers.get('Authorization')

        if token:
            # Elimina el prefijo "Token " si lo hay
            if token.startswith("Token "):
                token = token.split(" ")[1]

            try:
                token_obj = TokenUsuario.objects.get(token=token)
                token_obj.delete()
                return Response({'mensaje': 'Logout exitoso'}, status=status.HTTP_200_OK)
            except TokenUsuario.DoesNotExist:
                return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Token no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)

class UsuarioActualView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user 
        serializer = UsuarioDatosSerializer(usuario)
        return Response(serializer.data)

