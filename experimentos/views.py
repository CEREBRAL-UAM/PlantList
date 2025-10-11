from .models import *
from .serializers import *
from .base import ModelViewSet, APIView
from rest_framework.response import Response

class TipoEstimulacionView(ModelViewSet):
    serializer_class = TipoEstimulacionSerializer
    queryset = TipoEstimulacion.objects.all()

class MaterialView(ModelViewSet):
    serializer_class = MaterialSerializer
    queryset = Material.objects.all()

class ElectrodosView(ModelViewSet):
    serializer_class = ElectrodosSerializer
    queryset = Electrodos.objects.all()

class UbicacionesView(ModelViewSet):
    serializer_class = UbicacionesSerializer
    queryset = Ubicaciones.objects.all()

class SueloView(ModelViewSet):
    serializer_class = SueloSerializer
    queryset = Suelo.objects.all()

class EtapaDesarrolloView(ModelViewSet):
    serializer_class = EtapaDesarrolloSerializer
    queryset = EtapaDesarrollo.objects.all()

class OrigenCrianzaView(ModelViewSet):
    serializer_class = OrigenCrianzaSerializer
    queryset = OrigenCrianza.objects.all()

class PlagasView(ModelViewSet):
    serializer_class = PlagasSerializer
    queryset = Plagas.objects.all()

class PlantaIndividuoView(ModelViewSet):
    serializer_class = PlantaIndividuoSerializer
    queryset = PlantaIndividuo.objects.all()

class ExperimentosListadoView(APIView):
    def get(self, request):
        return Response({"Solo roles autorizados ven esto."})
