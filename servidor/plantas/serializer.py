from rest_framework import serializers
from .models import Planta, Especie, PartePlanta, PlantaPartes, Espacio, EspaciosUsuarios, PlantasEspacios

class PlantaSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()

    class Meta:
        model = Planta
        fields = '__all__'

    def get_foto(self, obj):
        if obj.foto:
            return obj.foto.url   
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