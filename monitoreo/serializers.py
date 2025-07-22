from rest_framework import serializers
from .models import SensadoAmbiental, sensadoSuelo, SensadoContaminantes, Circuito

class SensadoAmbientalSerializer(serializers.ModelSerializer):
    id_bluetooth = serializers.SerializerMethodField()
    descripcion = serializers.SerializerMethodField()

    class Meta:
        model = SensadoAmbiental
        fields = [
            'FechaSensado',
            'id_Circuito',
            'id_bluetooth',
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
        circuito = Circuito.objects.filter(id_Circuito=obj.id_Circuito).first()
        return circuito.id_bluetooth if circuito else None

    def get_descripcion(self, obj):
        circuito = Circuito.objects.filter(id_Circuito=obj.id_Circuito).first()
        return circuito.descripcion if circuito else None

class SensadoSueloSerializer(serializers.ModelSerializer):
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
            'id_Circuito',
            'id_PlantaIndividuo',
            'nombre_suelo',
            'descripcion_suelo',
        ]

class SensadoContaminantesSerializer(serializers.ModelSerializer):
    id_Circuito = serializers.IntegerField(source="circuito.id_Circuito")
    id_bluetooth = serializers.CharField(source="circuito.id_bluetooth")
    descripcion = serializers.CharField(source="circuito.descripcion")

    class Meta:
        model = SensadoContaminantes
        fields = [
            'fechaSensado',
            'id_Circuito',
            'id_bluetooth',
            'descripcion',
            'CO',
            'CO2',
            'O',
            'COVs',
        ]
