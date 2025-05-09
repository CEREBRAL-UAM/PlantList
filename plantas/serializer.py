from rest_framework import serializers
from .models import Planta, Especie, PartePlanta, PlantaPartes

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