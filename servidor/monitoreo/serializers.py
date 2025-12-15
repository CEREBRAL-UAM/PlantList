from rest_framework import serializers
from .models import SensadoAmbiental, sensadoSuelo, SensadoContaminantes, Circuito

class SensadoAmbientalSerializer(serializers.ModelSerializer):
    bluetooth = serializers.SerializerMethodField()
    descripcion = serializers.SerializerMethodField()

    class Meta:
        model = SensadoAmbiental
        fields = [
            'FechaSensado',
            'bluetooth',
            'descripcion',
            'TempAmbiental',
            'Humedad',
            'Lux',
            'Radiacion',
            'Luz_Azul',
            'Luz_Roja',
            'Luz_Blanca',
        ]

    def get_id_bluetooth(self, obj):
        circuito = Circuito.objects.filter(bluetooth=obj.bluetooth).first()
        return circuito.id_bluetooth if circuito else None

    def get_descripcion(self, obj):
        circuito = Circuito.objects.filter(bluetooth=obj.bluetooth).first()
        return circuito.descripcion if circuito else None

class SensadoSueloSerializer(serializers.ModelSerializer):
    bluetooth = serializers.CharField()
    descripcion = serializers.SerializerMethodField()
    nombre_suelo = serializers.CharField(source='suelo.Nombre_Cientifico', default='Desconocido')
    descripcion_suelo = serializers.CharField(source='suelo.Descripcion', default='Sin descripción')

    class Meta:
        model = sensadoSuelo
        fields = [
            'id_EnergiaPlanta',
            'fechaSensado',
            'Voltaje',
            'Amperaje',
            'PhSuelo',
            'HumedadSuelo',
            'bluetooth',
            'descripcion',
            'id_PlantaIndividuo',
            'nombre_suelo',
            'descripcion_suelo',
        ]
    
    def get_id_bluetooth(self, obj):
        circuito = Circuito.objects.filter(bluetooth=obj.bluetooth).first()
        return circuito.id_bluetooth if circuito else None

    def get_descripcion(self, obj):
        circuito = Circuito.objects.filter(bluetooth=obj.bluetooth).first()
        return circuito.descripcion if circuito else None

class SensadoContaminantesSerializer(serializers.ModelSerializer):
    bluetooth = serializers.IntegerField(source="circuito.bluetooth")
    descripcion = serializers.CharField(source="circuito.descripcion")

    class Meta:
        model = SensadoContaminantes
        fields = [
            'fechaSensado',
            'bluetooth',
            'descripcion',
            'CO',
            'CO2',
            'O',
            'COVs',
        ]
