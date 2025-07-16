from rest_framework import serializers
from .models import SensadoAmbiental, sensadoSuelo, SensadoContaminantes


class SensadoAmbientalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensadoAmbiental
        fields = ['FechaSensado', 'TempAmbiental', 'Humedad', 'Lux', 'Radiacion']

class SensadoSueloSerializer(serializers.ModelSerializer):
    class Meta:
        model = sensadoSuelo
        fields = ['id_EnergiaPlanta', 'fechaSensado', 'Voltaje', 'Amperaje', 'PhSuelo', 'HumedadSuelo']

class SensadoContaminantesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensadoContaminantes
        fields = ['fechaSensado', 'CO', 'CO2', 'O', 'COVs']