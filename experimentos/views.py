from rest_framework import viewsets
from .models import *
from .serializers import *

class TipoEstimulacionView(viewsets.ModelViewSet):
    serializer_class = TipoEstimulacionSerializer
    queryset = TipoEstimulacion.objects.all()

class MaterialView(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    queryset = Material.objects.all()

class ElectrodosView(viewsets.ModelViewSet):
    serializer_class = ElectrodosSerializer
    queryset = Electrodos.objects.all()

class UbicacionesView(viewsets.ModelViewSet):
    serializer_class = UbicacionesSerializer
    queryset = Ubicaciones.objects.all()

class SueloView(viewsets.ModelViewSet):
    serializer_class = SueloSerializer
    queryset = Suelo.objects.all()

class EtapaDesarrolloView(viewsets.ModelViewSet):
    serializer_class = EtapaDesarrolloSerializer
    queryset = EtapaDesarrollo.objects.all()

class OrigenCrianzaView(viewsets.ModelViewSet):
    serializer_class = OrigenCrianzaSerializer
    queryset = OrigenCrianza.objects.all()

class PlagasView(viewsets.ModelViewSet):
    serializer_class = PlagasSerializer
    queryset = Plagas.objects.all()

class PlantaIndividuoView(viewsets.ModelViewSet):
    serializer_class = PlantaIndividuoSerializer
    queryset = PlantaIndividuo.objects.all()