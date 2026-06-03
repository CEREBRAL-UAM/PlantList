from rest_framework import serializers
from .models import (
    SensadoAmbiental,
    sensadoSuelo,
    SensadoContaminantes,
    Circuito,
    PlantaIndividuo,
    Suelo,
)

from plantas.models import Espacio   # 
from usuarios.models import Usuario  # 

class SensadoAmbientalSerializer(serializers.ModelSerializer):

    circuito = serializers.PrimaryKeyRelatedField(
        queryset=Circuito.objects.all(),
        write_only=True
    )
    
    Voltaje = serializers.FloatField(required=False)
    
    Amperaje = serializers.FloatField(required=False)

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
        model = SensadoAmbiental

        fields = [
            "circuito",
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
            "HumedadSuelo",
        ]
        
        def create(self, request, *args, **kwargs):
            print("DATA RECIBIDA:", request.data)

            serializer = self.get_serializer(data=request.data)

            print("VALID:", serializer.is_valid())
            print("ERRORS:", serializer.errors)

            serializer.is_valid(raise_exception=True)

            self.perform_create(serializer)

            print("GUARDADO:", serializer.data)

            return Response(serializer.data, status=201)


class SensadoSueloSerializer(serializers.ModelSerializer):
    circuito = serializers.SlugRelatedField(
        queryset=Circuito.objects.all(),
        slug_field="bluetooth",
        write_only=True
    )

    bluetooth = serializers.SerializerMethodField()
    id_espacios = serializers.SerializerMethodField()
    nombre_espacio = serializers.SerializerMethodField()
    tipo_circuito = serializers.SerializerMethodField()

    planta_individuo = serializers.PrimaryKeyRelatedField(
        queryset=PlantaIndividuo.objects.all(),
        write_only=True
    )

    id_PlantaIndividuo = serializers.IntegerField(
        source="planta_individuo.id_PlantaIndividuo",
        read_only=True
    )

    id_Suelo = serializers.SerializerMethodField()

    nombre_suelo = serializers.CharField(
        source="planta_individuo.id_Suelo.Nombre_Cientifico",
        default="Desconocido",
        read_only=True
    )

    descripcion_suelo = serializers.CharField(
        source="planta_individuo.id_Suelo.Descripcion",
        default="Sin descripción",
        read_only=True
    )

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

    def get_id_Suelo(self, obj):
        try:
            return obj.planta_individuo.id_Suelo.id_Suelo
        except Exception:
            return None

    class Meta:
        model = sensadoSuelo
        fields = [
            "fechaSensado",
            "Voltaje",
            "Amperaje",
            "PhSuelo",
            "HumedadSuelo",
            "circuito",
            "bluetooth",
            "id_espacios",
            "nombre_espacio",
            "planta_individuo",
            "id_PlantaIndividuo",
            "id_Suelo",
            "nombre_suelo",
            "descripcion_suelo",
            "tipo_circuito",
        ]
        
class SensadoContaminantesSerializer(serializers.ModelSerializer):
    circuito = serializers.PrimaryKeyRelatedField(
        queryset=Circuito.objects.all(),
        write_only=True
    )
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
            "circuito",
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
