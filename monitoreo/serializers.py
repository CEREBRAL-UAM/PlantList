from rest_framework import serializers
from .models import SensadoAmbiental

class SensadoAmbientalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensadoAmbiental
        fields = ['FechaSensado', 'TempAmbiental', 'Humedad', 'Lux', 'Radiacion']
