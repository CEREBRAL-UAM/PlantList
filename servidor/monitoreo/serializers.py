# serializers.py
from rest_framework import serializers
from .models import (
    SensadoAmbiental,
    sensadoSuelo,
    SensadoContaminantes,
    Circuito,
    Espacios,
    Suelo,
)

TIPO_MAP = {
    1: "AMBIENTAL",
    2: "SUELO",
    3: "CONTAMINANTES",
}


def tipo_to_str(tipo_id):
    if tipo_id is None:
        return "DESCONOCIDO"
    return TIPO_MAP.get(tipo_id, f"TIPO_{tipo_id}")


class SensadoAmbientalSerializer(serializers.ModelSerializer):
    bluetooth = serializers.CharField(source="circuito.bluetooth")
    id_espacios = serializers.IntegerField(source="circuito.espacio.id_espacios")
    nombre_espacio = serializers.CharField(
        source="circuito.espacio.nombre_espacio",
        default=None,
    )

    tipo_circuito = serializers.SerializerMethodField()
    Voltaje = serializers.SerializerMethodField()
    Amperaje = serializers.SerializerMethodField()

    def get_tipo_circuito(self, obj):
        return tipo_to_str(getattr(obj.circuito, "tipo_id", None))

    def get_Voltaje(self, obj):
        for attr in ("Voltaje", "voltaje"):
            if hasattr(obj, attr):
                return getattr(obj, attr)
        return None

    def get_Amperaje(self, obj):
        for attr in ("Amperaje", "amperaje"):
            if hasattr(obj, attr):
                return getattr(obj, attr)
        return None

    class Meta:
        model = SensadoAmbiental
        fields = [
            "FechaSensado",
            "bluetooth",
            "Voltaje",
            "Amperaje",
            "id_espacios",
            "nombre_espacio",   
            "tipo_circuito",
            "TempAmbiental",
            "Humedad",
            "Lux",
            "Radiacion",
            "Luz_Azul",
            "Luz_Roja",
            "Luz_Blanca",
        ]


class SensadoSueloSerializer(serializers.ModelSerializer):
    bluetooth = serializers.CharField(source="circuito.bluetooth")
    id_espacios = serializers.IntegerField(source="circuito.espacio.id_espacios")

    nombre_espacio = serializers.CharField(
        source="circuito.espacio.nombre_espacio",
        default=None,
    )

    tipo_circuito = serializers.SerializerMethodField()

    nombre_suelo = serializers.CharField(
        source="suelo.Nombre_Cientifico",
        default="Desconocido",
    )
    descripcion_suelo = serializers.CharField(
        source="suelo.Descripcion",
        default="Sin descripción",
    )

    def get_tipo_circuito(self, obj):
        return tipo_to_str(getattr(obj.circuito, "tipo_id", None))

    class Meta:
        model = sensadoSuelo
        fields = [
            "fechaSensado",
            "Voltaje",
            "Amperaje",
            "PhSuelo",
            "HumedadSuelo",
            "bluetooth",
            "id_espacios",
            "nombre_espacio",     
            "id_PlantaIndividuo",
            "nombre_suelo",
            "descripcion_suelo",
            "tipo_circuito",
        ]


class SensadoContaminantesSerializer(serializers.ModelSerializer):
    bluetooth = serializers.CharField(source="circuito.bluetooth")
    id_espacios = serializers.IntegerField(source="circuito.espacio.id_espacios")
    nombre_espacio = serializers.CharField(
        source="circuito.espacio.nombre_espacio",
        default=None,
    )

    tipo_circuito = serializers.SerializerMethodField()

    def get_tipo_circuito(self, obj):
        return tipo_to_str(getattr(obj.circuito, "tipo_id", None))

    class Meta:
        model = SensadoContaminantes
        fields = [
            "fechaSensado",
            "bluetooth",
            "id_espacios",
            "nombre_espacio",  
            "tipo_circuito",
            "CO",
            "CO2",
            "O",
            "COVs",
        ]
        extra_kwargs = {
            "CO": {"coerce_to_string": False},
            "CO2": {"coerce_to_string": False},
            "O": {"coerce_to_string": False},
            "COVs": {"coerce_to_string": False},
        }


class EspacioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Espacios
        fields = ["id_espacios", "nombre_espacio"]
