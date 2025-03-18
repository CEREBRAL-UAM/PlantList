from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Usuario
        fields = '__all__'

class CustomRegisterSerializer(RegisterSerializer):
    apellidoP = serializers.CharField(max_length=20)
    apellidoM = serializers.CharField(max_length=20)
    fotoPerfil = serializers.ImageField(required=False, allow_null=True)

    def custom_signup(self, request, user):
        user.apellidoP = self.validated_data.get('apellidoP', '')
        user.apellidoM = self.validated_data.get('apellidoM', '')
        user.fotoPerfil = self.validated_data.get('fotoPerfil', None)
        user.save()