from rest_framework import serializers
from .models import Planta, Especie, Enfermedad, Plaga

class PlantaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Planta
        fields = '__all__'

class EspecieSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Especie 
        fields = '__all__'

class EnfermedadSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Enfermedad 
        fields = '__all__'

class PlagaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Plaga
        fields = '__all__'