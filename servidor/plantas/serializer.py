from django.db import \
    connection  # Importante para saltarnos el error del campo 'id'
from rest_framework import serializers

from .models import (Espacio, EspaciosUsuarios, Especie, PartePlanta, Planta,
                     PlantaPartes, PlantasEspacios)


class PlantaSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()
    # Nuevo campo para el contador
    cantidad = serializers.SerializerMethodField()

    class Meta:
        model = Planta
        fields = '__all__'

    def get_foto(self, obj):
        if obj.foto:
            return obj.foto.url   
        return None

    def get_cantidad(self, obj):
        # 1. Obtenemos el request para leer la URL (?id_espacios=7)
        request = self.context.get('request')
        if not request:
            return None
        
        # 2. Extraemos el ID del espacio que viene en la petición de Red
        espacio_id = request.query_params.get('id_espacios')
        if not espacio_id:
            return None

        # 3. SQL Crudo para evitar 'Unknown column plantasespacios.id'
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT cantidad FROM plantasespacios WHERE id_Planta = %s AND id_espacio = %s",
                    [obj.id_planta, espacio_id]
                )
                fila = cursor.fetchone()
                # Retornamos solo el número (ej: 5)
                return fila[0] if fila else None
        except Exception:
            return None

class EspecieSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()

    class Meta:
        model = Especie
        fields = '__all__'

    def get_foto(self, obj):
        if obj.foto:
            return obj.foto.url   
        return None

class PartePlantaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = PartePlanta
        fields = '__all__'

class PlantaPartesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantaPartes
        fields = ['id_parteplanta', 'id_planta']

class EspaciosUsuariosSerializer(serializers.ModelSerializer):
    class Meta: 
        model = EspaciosUsuarios
        fields = ['id_usuario', 'id_espacios']
    
class PlantasEspaciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantasEspacios
        fields = '__all__'

class EspacioSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()

    class Meta:
        model = Espacio
        fields = '__all__'

    def get_foto(self, obj):
        if obj.foto:
            return obj.foto.url
        return None


class CrearEspacioSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Espacio 
        fields = ['nombre_espacio', 'foto']