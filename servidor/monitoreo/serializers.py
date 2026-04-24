# serializers.py
from rest_framework import serializers
from .models import (
    SensadoAmbiental,
    sensadoSuelo,
    SensadoContaminantes,
    Circuito,
    Suelo,
)

from plantas.models import Espacio   # 
from usuarios.models import Usuario  # 

class SensadoAmbientalSerializer(serializers.ModelSerializer):
    bluetooth = serializers.SerializerMethodField()
    id_espacios = serializers.SerializerMethodField()
    nombre_espacio = serializers.SerializerMethodField()

    tipo_circuito = serializers.SerializerMethodField()
    Voltaje = serializers.SerializerMethodField()
    Amperaje = serializers.SerializerMethodField()
    
    def get_bluetooth(self, obj):
        try:
            return obj.circuito.bluetooth
        except Exception:
            return None
 
    def get_nombre_espacio(self, obj):
        try:
            return obj.circuito.espacio.nombre_espacio
        except Exception:
            return None
    
    def get_id_espacios(self, obj):
        try:
            return obj.circuito.espacio.id_espacios
        except Exception:
            return None
       
    def get_tipo_circuito(self, obj):
        try:
            return obj.circuito.tipo.descripcion.upper()
        except Exception:
            return "DESCONOCIDO"

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
    bluetooth = serializers.SerializerMethodField()
    id_espacios = serializers.SerializerMethodField()
    nombre_espacio = serializers.SerializerMethodField()
    
    tipo_circuito = serializers.SerializerMethodField()
    
    def get_bluetooth(self, obj):
        try:
            return obj.circuito.bluetooth
        except Exception:
            return None
 
    def get_nombre_espacio(self, obj):
        try:
            return obj.circuito.espacio.nombre_espacio
        except Exception:
            return None
    
    def get_id_espacios(self, obj):
        try:
            return obj.circuito.espacio.id_espacios
        except Exception:
            return None
    
    nombre_suelo = serializers.CharField(
        source="suelo.Nombre_Cientifico",
        default="Desconocido",
    )
    descripcion_suelo = serializers.CharField(
        source="suelo.Descripcion",
        default="Sin descripción",
    )

    def get_tipo_circuito(self, obj):
        try:
            return obj.circuito.tipo.descripcion.upper()
        except Exception:
            return "DESCONOCIDO"

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
    bluetooth = serializers.SerializerMethodField()
    id_espacios = serializers.SerializerMethodField()
    nombre_espacio = serializers.SerializerMethodField()

    tipo_circuito = serializers.SerializerMethodField()
    
    def get_bluetooth(self, obj):
        try:
            return obj.circuito.bluetooth
        except Exception:
            return None
 
    def get_nombre_espacio(self, obj):
        try:
            return obj.circuito.espacio.nombre_espacio
        except Exception:
            return None
    
    def get_id_espacios(self, obj):
        try:
            return obj.circuito.espacio.id_espacios
        except Exception:
            return None
    
    def get_tipo_circuito(self, obj):
        try:
            return obj.circuito.tipo.descripcion.upper()
        except Exception:
            return "DESCONOCIDO"
    
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
        model = Espacio 
        fields = ["id_espacios", "nombre_espacio"]
