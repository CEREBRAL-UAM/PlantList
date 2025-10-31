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
    ExperimentoTacto,
    ExperimentoProximidad)

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
    
#
class PlantaIndividuoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantaIndividuo
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
    
class ExperimentoTactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentoTacto
        fields = '__all__'

class ExperimentoProximidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentoProximidad
        fields = '__all__'