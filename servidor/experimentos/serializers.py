from rest_framework import serializers
from .models import (
    TipoEstimulacion, 
    Material,
    Electrodos,
    Ubicaciones,
    Suelo, 
    EtapaDesarrollo, 
    OrigenCrianza, 
    Plagas, 
    PlantaIndividuo,
    Video,
    Experimento,
)
from monitoreo.models import Circuito
from .utils import generar_codigo_video
from datetime import datetime

class TipoEstimulacionSerializer(serializers.ModelSerializer): #
    class Meta:
        model = TipoEstimulacion
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class ElectrodosSerializer(serializers.ModelSerializer): #
    class Meta:
        model = Electrodos
        fields = '__all__'

class UbicacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicaciones
        fields = '__all__'
    
class SueloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suelo
        fields = '__all__'
    
class EtapaDesarrolloSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapaDesarrollo
        fields = '__all__'

class OrigenCrianzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrigenCrianza
        fields = '__all__'

class PlagasSerializer(serializers.ModelSerializer): #
    class Meta:
        model = Plagas
        fields = '__all__'
    
class PlantaIndividuoSerializer(serializers.ModelSerializer):
    id_suelo = SueloSerializer(read_only=True)
    id_etapa = EtapaDesarrolloSerializer(read_only=True)
    id_OrigenCrianza = OrigenCrianzaSerializer(read_only=True)
    plagas_id_Plaga = PlagasSerializer(read_only=True)

    class Meta:
        model = PlantaIndividuo
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"
        read_only_fields = ("codigo_unico",)

    def create(self, validated_data):
        ahora = datetime.now()
        codigo = generar_codigo_video(ahora, ahora)

        validated_data["codigo_unico"] = codigo
        return super().create(validated_data)
    
class ExperimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experimento
        fields = '__all__'
        read_only_fields = ('id_Usuario',)

class GestionExperimentoSerializer(serializers.ModelSerializer):
    tipo_estimulacion = serializers.CharField(
        source="id_TipoEstimulacion.nombre",
        read_only=True
    )
    espacio_nombre = serializers.CharField(
        source="id_espacios.nombre_espacio",
        read_only=True
    )
    video_url = serializers.SerializerMethodField()

    def get_video_url(self, obj):
        request = self.context.get("request")
        try:
            url = obj.id_Video.archivo.url
            return request.build_absolute_uri(url)
        except:
            return None

    class Meta:
        model = Experimento
        fields = [
            "id_Experimento",
            "tipo_estimulacion",
            "Fecha_Sensado",
            "Hora_inicio",
            "Hora_fin",
            "espacio_nombre",
            "video_url"
        ]

class CircuitosPorEspacioSerializer(serializers.ModelSerializer):
    tipo = serializers.CharField(
        source="tipo.descripcion",
        read_only=True
    )

    class Meta:
        model = Circuito
        fields = ["bluetooth", "tipo"]