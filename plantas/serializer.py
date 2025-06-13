from rest_framework import serializers
from .models import Planta, Especie, PartePlanta, PlantaPartes, Espacio

class PlantaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Planta
        fields = '__all__'

class EspecieSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Especie 
        fields = '__all__'

class PartePlantaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = PartePlanta
        fields = '__all__'

class PlantaPartesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantaPartes
        fields = ['id_parteplanta', 'id_planta']

class EspacioSerializer(serializers.ModelSerializer):
    def get_foto(self, obj):
        request = self.context.get('request')
        if obj.foto and request:
            return request.build_absolute_uri(obj.foto.url)
        return None
    class Meta:
        model = Espacio
        fields = '__all__'
    


class CrearEspacioSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Espacio 
        fields = ['nombre_espacio', 'foto']