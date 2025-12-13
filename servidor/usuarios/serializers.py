from rest_framework import serializers
from .models import Usuario
from django.contrib.auth.hashers import make_password

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    ConfirmarContrasenia = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['Contrasenia'] != data['ConfirmarContrasenia']:
            raise serializers.ValidationError({"Contrasenia": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        validated_data.pop('ConfirmarContrasenia')
        validated_data['Contrasenia'] = make_password(validated_data['Contrasenia'])
        return super().create(validated_data)

    class Meta: 
        model = Usuario 
        fields = ['Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'Telefono', 'CorreoElectronico', 'Contrasenia', 'ConfirmarContrasenia']
        extra_kwargs = {
            'Contrasenia': {'write_only': True}
        }
    
class UsuarioLoginSerializer(serializers.ModelSerializer):
    CorreoElectronico = serializers.EmailField()
    Contrasenia = serializers.CharField()

    class Meta: 
        model = Usuario
        fields = ['CorreoElectronico', 'Contrasenia']

class UsuarioDatosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ['Contrasenia']

class CambioContrasenaSerializer(serializers.Serializer):
    contrasena_actual = serializers.CharField(write_only=True)
    nueva_contrasena = serializers.CharField(write_only=True)
    confirmar_contrasena = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nueva_contrasena'] != data['confirmar_contrasena']:
            raise serializers.ValidationError("Las nuevas contraseñas no coinciden.")
        return data
