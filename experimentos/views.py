from .models import *
from .serializers import *
from .base import RolModelViewSet, RolAPIView
from rest_framework.response import Response

class TipoEstimulacionView(RolModelViewSet):
    serializer_class = TipoEstimulacionSerializer
    queryset = TipoEstimulacion.objects.all()

class MaterialView(RolModelViewSet):
    serializer_class = MaterialSerializer
    queryset = Material.objects.all()

class ElectrodosView(RolModelViewSet):
    serializer_class = ElectrodosSerializer
    queryset = Electrodos.objects.all()

class UbicacionesView(RolModelViewSet):
    serializer_class = UbicacionesSerializer
    queryset = Ubicaciones.objects.all()

class SueloView(RolModelViewSet):
    serializer_class = SueloSerializer
    queryset = Suelo.objects.all()

class EtapaDesarrolloView(RolModelViewSet):
    serializer_class = EtapaDesarrolloSerializer
    queryset = EtapaDesarrollo.objects.all()

class OrigenCrianzaView(RolModelViewSet):
    serializer_class = OrigenCrianzaSerializer
    queryset = OrigenCrianza.objects.all()

class PlagasView(RolModelViewSet):
    serializer_class = PlagasSerializer
    queryset = Plagas.objects.all()

class PlantaIndividuoView(RolModelViewSet):
    serializer_class = PlantaIndividuoSerializer
    queryset = PlantaIndividuo.objects.all()

class ExperimentosListadoView(RolAPIView):
    def get(self, request):
        return Response({"Solo roles autorizados ven esto."})
