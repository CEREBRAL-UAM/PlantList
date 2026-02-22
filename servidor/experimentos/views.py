from .models import *
from monitoreo.models import Circuito, TipoCircuito
from .serializers import *
from .base import RolModelViewSet, RolAPIView
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime
from .utils import generar_codigo_video
from rest_framework.parsers import MultiPartParser, FormParser

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
    
class ExperimentoView(RolModelViewSet):
    serializer_class = ExperimentoSerializer

    def get_queryset(self):
        user_id = getattr(self.request.user, "pk", None)
        base = Experimento.objects.all()
        if not user_id:
            return base.none()
        return base.filter(id_Usuario=user_id).order_by("-Fecha_Sensado", "-id_Experimento")
    
    def perform_create(self, serializer):
        serializer.save(id_Usuario=self.request.user)

class GestionExperimentosView(RolAPIView):
    def get(self, request):
        user = request.user
        if not user or not user.pk:
            return Response({"results": []})

        qs = Experimento.objects.filter(id_Usuario=user)

        # Filtros
        espacio_id = request.query_params.get("espacio_id")
        tipo_id = request.query_params.get("tipo_id")
        fecha = request.query_params.get("fecha")

        if espacio_id:
            qs = qs.filter(id_espacios_id=espacio_id)

        if tipo_id:
            qs = qs.filter(id_TipoEstimulacion_id=tipo_id)

        if fecha:
            qs = qs.filter(Fecha_Sensado=fecha)  #

        qs = qs.select_related(
            "id_TipoEstimulacion",
            "id_espacios",
            "id_Video"
        ).order_by(
            "-Fecha_Sensado",
            "-id_Experimento"
        )

        serializer = GestionExperimentoSerializer(
            qs,
            many=True,
            context={"request": request}
        )
        return Response({"results": serializer.data})

class CircuitosPorEspacioView(RolAPIView):
    def get(self, request):
        espacio_id = request.query_params.get("espacioId")

        if not espacio_id:
            return Response({"results": []})

        circuitos = Circuito.objects.filter(
            id_espacios=espacio_id 
        ).order_by("bluetooth")

        # precargar tipos de circuito
        tipos = {
            tc.id_tipo_circuito: tc.descripcion
            for tc in TipoCircuito.objects.all()
        }

        data = [
            {
                "bluetooth": c.bluetooth,
                "tipo": tipos.get(c.id_tipo_circuito, "Circuito")
            }
            for c in circuitos
        ]

        return Response({"results": data})
    
class VideoView(RolModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    parser_classes = (MultiPartParser, FormParser) 

    def perform_create(self, serializer):
        ahora = datetime.now()
        codigo = generar_codigo_video(ahora, ahora)
        serializer.save(codigo_unico=codigo)