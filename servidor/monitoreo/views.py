from datetime import time, timedelta
from zoneinfo import ZoneInfo
from datetime import datetime
from django.db.models.functions import TruncDate, TruncTime
from django.utils.timezone import now
from django.utils import timezone as dj_timezone
from django.utils.dateparse import parse_date

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import (
    SensadoAmbiental,
    sensadoSuelo,
    SensadoContaminantes,
    Circuito,
)

from plantas.models import EspaciosUsuarios
from plantas.models import Espacio
from usuarios.models import Usuario


from .serializers import (
    SensadoAmbientalSerializer,
    SensadoSueloSerializer,
    SensadoContaminantesSerializer,
    #EspacioSerializer,
)

from usuarios.authentication import TokenAuthentication
from monitoreo.permissions import IsProjectMemberOrAdmin


TIPO_AMBIENTAL = 1
TIPO_SUELO = 2
TIPO_CONTAMINANTES = 3

SERVER_TZ = ZoneInfo("America/Mexico_City")

def _to_int(v):
    try:
        return int(v)
    except Exception:
        return None


def _resolve_uid_from_usuario_table(user):
    # Caso normal: modelo Usuario propio
    uid = getattr(user, "id_Usuario", None)
    if uid:
        return uid

    return getattr(user, "id", None)

def _user_ctx(request):
    user = getattr(request, "user", None)
    has_token = bool(request.headers.get("Authorization"))

    ctx = {
        "is_auth": False,
        "has_token": has_token,
        "user_id": None,
        "allowed_spaces": [],
    }

    if not user or not getattr(user, "is_authenticated", False):
        return ctx

    uid = getattr(user, "id_Usuario", None) or getattr(user, "id", None)
    if not uid:
        return ctx

    ctx["is_auth"] = True
    ctx["user_id"] = uid

    ctx["allowed_spaces"] = list(
        EspaciosUsuarios.objects.filter(id_usuario=uid)
        .values_list("id_espacios", flat=True)   
        .order_by("id_espacios")
    )


    return ctx

def _role_limits(is_auth: bool):
    """Ventana de datos: últimos 7 días y máximo 150 lecturas."""
    if is_auth:
        return 150, now() - timedelta(days=7)
    return 0, now()


def parse_server_local(dt_str: str):
    """Convierte hora local/ISO/UTC a UTC real."""
    if not dt_str:
        return None
    if dt_str.endswith("Z"):
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    dt_naive = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%S")
    return dt_naive.replace(tzinfo=SERVER_TZ).astimezone(dj_timezone.utc)


class SensadoAmbientalViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SensadoAmbientalSerializer
    queryset = SensadoAmbiental.objects.all().order_by("-FechaSensado")[:100]

    def get_queryset(self):
        ctx = _user_ctx(self.request)

        if not ctx["is_auth"]:
            return SensadoAmbiental.objects.all().order_by("-FechaSensado")[:1]

        if not ctx["allowed_spaces"]:
            return SensadoAmbiental.objects.none()

        limit, since_dt = _role_limits(True)

        circuit_bts = Circuito.objects.filter(
            espacio__id_espacios__in=ctx["allowed_spaces"],
            tipo__id_tipo_circuito=TIPO_AMBIENTAL
        ).values_list("bluetooth", flat=True)

        qs = SensadoAmbiental.objects.filter(
            FechaSensado__gte=since_dt,
            circuito__bluetooth__in=circuit_bts
        ).order_by("-FechaSensado")

        return qs[:limit]

    # -------- ESPACIOS ----------
    @action(
        methods=["get"], detail=False, url_path="espacios",
        authentication_classes=[TokenAuthentication],
        permission_classes=[IsProjectMemberOrAdmin],
    )
    def espacios(self, request):
        ctx = _user_ctx(request)

        if not ctx["is_auth"]:
            return Response({"detail": "No autenticado."},
                            status=status.HTTP_401_UNAUTHORIZED)

        qs = Espacios.objects.filter(
            id_espacios__in=ctx["allowed_spaces"]
        ).order_by("id_espacios")

        data = [
            {"id": e.id_espacios, "nombre": e.nombre_espacio or f"Espacio #{e.id_espacios}"}
            for e in qs
        ]
        return Response(data)

    # -------- CIRCUITOS AMBIENTALES ----------
    @action(
        methods=["get"], detail=False, url_path="circuitos",
        authentication_classes=[TokenAuthentication],
        permission_classes=[IsProjectMemberOrAdmin],
    )
    def circuitos(self, request):
        ctx = _user_ctx(request)

        if not ctx["is_auth"]:
            return Response({"detail": "No autenticado."},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not ctx["allowed_spaces"]:
            return Response([])

        qs = Circuito.objects.filter(
            espacio__id_espacios__in=ctx["allowed_spaces"],
            tipo__id_tipo_circuito=TIPO_AMBIENTAL,
        ).select_related("espacio").order_by("bluetooth")

        items = [
            {
                "bluetooth": c.bluetooth,
                "id_espacios": c.espacio.id_espacios,
                "tipo_circuito": "AMBIENTAL",
            }
            for c in qs
        ]
        return Response(items)

    # -------- RANGO AMBIENTAL ----------
    @action(
        methods=["get"], detail=False, url_path="rango",
        authentication_classes=[TokenAuthentication],
        permission_classes=[IsProjectMemberOrAdmin],
    )
    def rango(self, request):
        ctx = _user_ctx(request)

        if not ctx["is_auth"]:
            return Response({"detail": "No autenticado."},
                            status=status.HTTP_401_UNAUTHORIZED)

        bluetooth = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )

        if not bluetooth:
            return Response(
                {"detail": "Parámetro 'bluetooth' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            c = Circuito.objects.select_related("espacio").get(bluetooth=bluetooth)
        except Circuito.DoesNotExist:
            return Response({"detail": "Circuito no existe."},
                            status=status.HTTP_404_NOT_FOUND)

        if c.espacio.id_espacios not in ctx["allowed_spaces"]:
            raise PermissionDenied("No tienes acceso a este circuito.")
        if c.tipo_id != TIPO_AMBIENTAL:
            raise PermissionDenied("Este circuito no es AMBIENTAL.")

        qs = SensadoAmbiental.objects.filter(circuito__bluetooth=bluetooth)

        start = request.query_params.get("start")
        end = request.query_params.get("end")
        fi = request.query_params.get("fecha_inicio")
        ff = request.query_params.get("fecha_fin")

        if start and end:
            start_dt = parse_server_local(start)
            end_dt = parse_server_local(end)
            qs = qs.filter(FechaSensado__gte=start_dt,
                           FechaSensado__lte=end_dt)
        else:
            if fi:
                d1 = parse_date(fi)
                if d1:
                    qs = qs.filter(FechaSensado__date__gte=d1)
            if ff:
                d2 = parse_date(ff)
                if d2:
                    qs = qs.filter(FechaSensado__date__lte=d2)

        return Response(
            SensadoAmbientalSerializer(qs.order_by("FechaSensado"), many=True).data
        )

class DatosSueloView(APIView):
    """
    GET /api/monitoreo/suelo/

    Reglas:
    - Público REAL (sin token) → 1 último global
    - Autenticado sin espacios → []
    - Autenticado con espacios → últimos N del usuario
    """
    

    def get(self, request):
        ctx = _user_ctx(request)

        qs = sensadoSuelo.objects.select_related(
            "circuito", "circuito__espacio"
        )

        bluetooth = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )

        if bluetooth:
            qs = qs.filter(circuito__bluetooth=bluetooth)

        # =====================
        # MODO PÚBLICO REAL
        # =====================
        if not ctx["is_auth"]:
            data = SensadoSueloSerializer(
                qs.order_by("-fechaSensado")[:1],
                many=True
            ).data
            return Response(data)

        # =====================
        # AUTENTICADO SIN ESPACIOS
        # =====================
        if not ctx["allowed_spaces"]:
            return Response([], status=status.HTTP_200_OK)

        # =====================
        # AUTENTICADO CON ESPACIOS
        # =====================
        limit, since_dt = _role_limits(True)

        qs = qs.filter(
            fechaSensado__gte=since_dt,
            circuito__espacio__id_espacios__in=ctx["allowed_spaces"],
            circuito__tipo__id_tipo_circuito=TIPO_SUELO,
        )

        data = SensadoSueloSerializer(
            qs.order_by("-fechaSensado")[:limit],
            many=True
        ).data

        return Response(data)
    
class SensadoSueloViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SensadoSueloSerializer

    def get_queryset(self):
        ctx = _user_ctx(self.request)
        if not ctx["is_auth"] or not ctx["allowed_spaces"]:
            return sensadoSuelo.objects.none()

        limit, since_dt = _role_limits(True)

        return sensadoSuelo.objects.filter(
            circuito__tipo__id_tipo_circuito=TIPO_SUELO,
            circuito__espacio__id_espacios__in=ctx["allowed_spaces"],
            fechaSensado__gte=since_dt,
        ).order_by("-fechaSensado")

    @action(
            methods=["get"], detail=False, url_path="rango",
            authentication_classes=[TokenAuthentication],
            permission_classes=[IsProjectMemberOrAdmin],
    )

    def rango(self, request):
        ctx = _user_ctx(request)

        if not ctx["allowed_spaces"]:
            return Response([])

        bluetooth = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )

        if not bluetooth:
            return Response(
                {"detail": "Parámetro 'bluetooth' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            c = Circuito.objects.select_related("espacio").get(bluetooth=bluetooth)
        except Circuito.DoesNotExist:
            return Response(
                {"detail": "Circuito no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if c.espacio.id_espacios not in ctx["allowed_spaces"]:
            raise PermissionDenied("No tienes acceso a este circuito.")
        
        if c.tipo_id != TIPO_SUELO:
            raise PermissionDenied("Este circuito no es SUELO.")
        
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        fi = request.query_params.get("fecha_inicio")
        ff = request.query_params.get("fecha_fin")

        qs = sensadoSuelo.objects.filter(
            circuito__bluetooth=bluetooth
        )

        if start and end:
            start_dt = parse_server_local(start)
            end_dt = parse_server_local(end)
            qs = qs.filter(
                fechaSensado__gte=start_dt,
                fechaSensado__lte=end_dt
            )
        
        else:
            if fi:
                d1 = parse_date(fi)
                if d1:
                    qs = qs.filter(fechaSensado__date__gte=d1)
            if ff:
                d2 = parse_date(ff)
                if d2:
                    qs = qs.filter(fechaSensado__date__lte=d2)
        
        return Response(
            SensadoSueloSerializer(
                qs.order_by("fechaSensado"),
                many=True
            ).data
        )
    
class HistoricosSueloFacets(APIView):
    """
    GET /api/monitoreo/suelo/facets/?id_espacios=&bluetooth=&fecha=

    Reglas:
    - Público REAL (sin token) → todos los espacios
    - Usuario con token → SOLO sus espacios
    - Usuario con token sin espacios → TODO vacío
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsProjectMemberOrAdmin]

    def get(self, request, *args, **kwargs):
        ctx = _user_ctx(request)

        id_esp = _to_int(request.query_params.get("id_espacios"))
        circuito_bt = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )
        fecha = request.query_params.get("fecha")

        base = sensadoSuelo.objects.select_related("circuito", "circuito__espacio")

        # =========================
        # ESPACIOS 
        # =========================
        if ctx["is_auth"]:
            print("CTX:", ctx)
            # Usuario con token
            if not ctx["allowed_spaces"]:
                return Response({
                    "espacios": [],
                    "circuitos": [],
                    "fechas": [],
                    "horas": [],
                })

            espacios_qs = Espacio.objects.filter(
                id_espacios__in=ctx["allowed_spaces"]
            ).order_by("id_espacios")

        else:
            espacios_qs = Espacio.objects.all().order_by("id_espacios")

        espacios_ids = list(
            espacios_qs.values_list("id_espacios", flat=True)
        )

        espacios = [
            {
                "id": e.id_espacios,
                "nombre": e.nombre_espacio or f"Espacio #{e.id_espacios}",
            }
            for e in espacios_qs
        ]

        # =========================
        # CIRCUITOS 
        # =========================
        if id_esp is not None:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios=id_esp,
                tipo__id_tipo_circuito=TIPO_SUELO
            )
        else:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios__in=espacios_ids,
                tipo__id_tipo_circuito=TIPO_SUELO,
            )

        circuitos = list(
            circuits_qs.values_list("bluetooth", flat=True)
            .distinct()
            .order_by("bluetooth")
        )

        # =========================
        # FECHAS
        # =========================
        if circuito_bt:
            qs_fechas = base.filter(circuito__bluetooth=circuito_bt)
        else:
            qs_fechas = base.filter(circuito__bluetooth__in=circuitos)

        fechas_qs = (
            qs_fechas
            .annotate(d=TruncDate("fechaSensado"))
            .values_list("d", flat=True)
            .distinct()
            .order_by("-d")
        )

        fechas = [d.isoformat() for d in fechas_qs]

        # =========================
        # HORAS
        # =========================
        qs_horas = qs_fechas
        if fecha:
            qs_horas = qs_horas.filter(fechaSensado__date=fecha)

        horas_times = (
            qs_horas
            .annotate(h=TruncTime("fechaSensado"))
            .values_list("h", flat=True)
            .distinct()
            .order_by("h")
        )

        horas = [
            t.strftime("%H:%M") if hasattr(t, "strftime") else str(t)[:5]
            for t in horas_times
        ]

        return Response({
            "espacios": espacios,
            "circuitos": circuitos,
            "fechas": fechas,
            "horas": horas,
        })

class DatosContaminantesView(APIView):
    """
    GET /api/monitoreo/contaminantes/?bluetooth=

    - Público: devuelve 1 último global
    - Autenticado sin espacios: []
    - Autenticado con espacios: últimos N del usuario
    """

    def get(self, request):
        ctx = _user_ctx(request)
        qs = SensadoContaminantes.objects.select_related("circuito").all()

        bluetooth = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )

        if bluetooth:
            qs = qs.filter(circuito__bluetooth=bluetooth)

        if not ctx["is_auth"]:
            data = SensadoContaminantesSerializer(
                qs.order_by("-fechaSensado")[:1], many=True
            ).data
            return Response(data)

        if not ctx["allowed_spaces"]:
            return Response([], status=200)

        limit, since_dt = _role_limits(True)

        qs = qs.filter(
            fechaSensado__gte=since_dt,
            circuito__espacio__id_espacios__in=ctx["allowed_spaces"],
            circuito__tipo__id_tipo_circuito=TIPO_CONTAMINANTES,
        )

        data = SensadoContaminantesSerializer(
            qs.order_by("-fechaSensado")[:limit], many=True
        ).data

        return Response(data)

class ContaminantesFacetsView(APIView):
    """
    GET /api/monitoreo/contaminantes/facets/?id_espacios=&bluetooth=&fecha=YYYY-MM-DD

    Reglas:
    - Público REAL (sin token) → todos los espacios
    - Usuario con token → SOLO sus espacios
    - Usuario con token sin espacios → TODO vacío
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsProjectMemberOrAdmin]

    def get(self, request):
        ctx = _user_ctx(request)

        id_esp = _to_int(request.query_params.get("id_espacios"))
        circuito_bt = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )
        fecha = request.query_params.get("fecha")

        base = SensadoContaminantes.objects.select_related(
            "circuito", "circuito__espacio"
        )

        # =========================
        # ESPACIOS
        # =========================
        if ctx["is_auth"]:
            # Usuario autenticado
            if not ctx["allowed_spaces"]:
                return Response({
                    "espacios": [],
                    "circuitos": [],
                    "fechas": [],
                    "horas": [],
                })

            espacios_qs = Espacio.objects.filter(
                id_espacios__in=ctx["allowed_spaces"]
            ).order_by("id_espacios")

        else:
            espacios_qs = Espacio.objects.all().order_by("id_espacios")

        espacios_ids = list(
            espacios_qs.values_list("id_espacios", flat=True)
        )

        espacios = [
            {
                "id": e.id_espacios,
                "nombre": e.nombre_espacio or f"Espacio #{e.id_espacios}",
            }
            for e in espacios_qs
        ]

        # =========================
        # CIRCUITOS CONTAMINANTES
        # =========================
        if id_esp is not None:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios=id_esp,
                tipo__id_tipo_circuito=TIPO_CONTAMINANTES,
            )
        else:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios__in=espacios_ids,
                tipo__id_tipo_circuito=TIPO_CONTAMINANTES,
            )

        circuitos = list(
            circuits_qs.values_list("bluetooth", flat=True)
            .distinct()
            .order_by("bluetooth")
        )

        # =========================
        # FECHAS
        # =========================
        if circuito_bt:
            qs_fechas = base.filter(circuito__bluetooth=circuito_bt)
        else:
            qs_fechas = base.filter(circuito__bluetooth__in=circuitos)

        fechas_qs = (
            qs_fechas
            .annotate(d=TruncDate("fechaSensado"))
            .values_list("d", flat=True)
            .distinct()
            .order_by("-d")
        )

        fechas = [d.isoformat() for d in fechas_qs]

        # =========================
        # HORAS
        # =========================
        qs_horas = qs_fechas
        if fecha:
            qs_horas = qs_horas.filter(fechaSensado__date=fecha)

        horas_times = (
            qs_horas
            .annotate(h=TruncTime("fechaSensado"))
            .values_list("h", flat=True)
            .distinct()
            .order_by("h")
        )

        horas = [
            t.strftime("%H:%M") if hasattr(t, "strftime") else str(t)[:5]
            for t in horas_times
        ]

        return Response({
            "espacios": espacios,
            "circuitos": circuitos,
            "fechas": fechas,
            "horas": horas,
        })

class SensadoContaminantesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SensadoContaminantesSerializer
    queryset = SensadoContaminantes.objects.all().order_by("-fechaSensado")

    def get_queryset(self):
        ctx = _user_ctx(self.request)

        if not ctx["is_auth"]:
            return SensadoContaminantes.objects.all().order_by("-fechaSensado")[:1]

        if not ctx["allowed_spaces"]:
            return SensadoContaminantes.objects.none()

        limit, since_dt = _role_limits(True)

        circuit_bts = Circuito.objects.filter(
            espacio__id_espacios__in=ctx["allowed_spaces"],
            tipo__id_tipo_circuito=TIPO_CONTAMINANTES,
        ).values_list("bluetooth", flat=True)

        qs = SensadoContaminantes.objects.filter(
            fechaSensado__gte=since_dt,
            circuito__bluetooth__in=circuit_bts,
        ).order_by("-fechaSensado")

        return qs[:limit]

    @action(
        methods=["get"], detail=False, url_path="rango",
        authentication_classes=[TokenAuthentication],
        permission_classes=[IsProjectMemberOrAdmin],
    )
    def rango(self, request):
        ctx = _user_ctx(request)

        bluetooth = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )

        if not bluetooth:
            return Response(
                {"detail": "Parámetro 'bluetooth' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            c = Circuito.objects.select_related("espacio").get(bluetooth=bluetooth)
        except Circuito.DoesNotExist:
            return Response({"detail": "Circuito no existe."},
                            status=status.HTTP_404_NOT_FOUND)

        if c.espacio.id_espacios not in ctx["allowed_spaces"]:
            raise PermissionDenied("No tienes acceso a este circuito.")

        if c.tipo_id != TIPO_CONTAMINANTES:
            raise PermissionDenied("Este circuito no es CONTAMINANTES.")

        start = request.query_params.get("start")
        end = request.query_params.get("end")
        fi = request.query_params.get("fecha_inicio")
        ff = request.query_params.get("fecha_fin")

        qs = SensadoContaminantes.objects.filter(
            circuito__bluetooth=bluetooth
        )

        if start and end:
            start_dt = parse_server_local(start)
            end_dt = parse_server_local(end)
            qs = qs.filter(
                fechaSensado__gte=start_dt,
                fechaSensado__lte=end_dt
            )
        else:
            if fi:
                d1 = parse_date(fi)
                if d1:
                    qs = qs.filter(fechaSensado__date__gte=d1)
            if ff:
                d2 = parse_date(ff)
                if d2:
                    qs = qs.filter(fechaSensado__date__lte=d2)

        return Response(
            SensadoContaminantesSerializer(
                qs.order_by("fechaSensado"),
                many=True
            ).data
        )

class HistoricosAmbientalesView(generics.ListAPIView):
    """
    GET /api/monitoreo/historicos/?id_espacios=&bluetooth=&fecha=YYYY-MM-DD&hora=HH:MM

    - SIN login: histórico público de todos los circuitos AMBIENTALES
    - CON login + espacios: restringe circuitos ambientales a los del usuario
    """

    serializer_class = SensadoAmbientalSerializer

    def get_queryset(self):
        request = self.request
        ctx = _user_ctx(request)

        qs = SensadoAmbiental.objects.select_related(
            "circuito", "circuito__espacio"
        )

        id_esp = _to_int(request.query_params.get("id_espacios"))
        circuito_bt = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )
        fecha = request.query_params.get("fecha")
        hora = request.query_params.get("hora")
        
        if ctx["is_auth"] and ctx["allowed_spaces"]:

            allowed = set(ctx["allowed_spaces"])

            # circuitos ambientales del usuario
            circuit_bts_allowed = Circuito.objects.filter(
                espacio__id_espacios__in=ctx["allowed_spaces"],
                tipo__id_tipo_circuito=TIPO_AMBIENTAL,
            ).values_list("bluetooth", flat=True)

            qs = qs.filter(circuito__bluetooth__in=circuit_bts_allowed)

            # Filtrar por espacio 
            if id_esp is not None:
                cids = Circuito.objects.filter(
                    espacio__id_espacios=id_esp,
                    tipo__id_tipo_circuito=TIPO_AMBIENTAL,
                ).values_list("bluetooth", flat=True)
                qs = qs.filter(circuito__bluetooth__in=cids)

            # Filtrar por circuito
            if circuito_bt:
                try:
                    c = Circuito.objects.only("espacio", "tipo_id").get(bluetooth=circuito_bt)
                    if c.espacio.id_espacios not in allowed or c.tipo_id != TIPO_AMBIENTAL:
                        raise PermissionDenied("No tienes acceso a este circuito.")
                except Circuito.DoesNotExist:
                    raise PermissionDenied("Circuito inválido.")

                qs = qs.filter(circuito__bluetooth=circuito_bt)

        else:
            qs = qs.filter(circuito__tipo__id_tipo_circuito=TIPO_AMBIENTAL)

            if id_esp is not None:
                qs = qs.filter(circuito__espacio__id_espacios=id_esp)

            if circuito_bt:
                qs = qs.filter(circuito__bluetooth=circuito_bt)

        if fecha:
            qs = qs.filter(FechaSensado__date=fecha)

        if hora:
            # hora = HH:MM
            if len(hora) == 5:
                qs = qs.filter(FechaSensado__time__startswith=hora)
            else:
                qs = qs.filter(FechaSensado__time=hora)

        return qs.order_by("-FechaSensado")

class HistoricosAmbientalesFacets(APIView):
    """
    GET /api/monitoreo/historicos/facets/?id_espacios=&bluetooth=&fecha=

    Reglas:
    - Público REAL (sin token) → todos los espacios
    - Usuario con token → SOLO sus espacios
    - Usuario con token sin espacios → TODO vacío
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsProjectMemberOrAdmin]

    def get(self, request, *args, **kwargs):
        ctx = _user_ctx(request)

        id_esp = _to_int(request.query_params.get("id_espacios"))
        circuito_bt = (
            request.query_params.get("bluetooth")
            or request.query_params.get("id_Circuito")
            or request.query_params.get("id_circuito")
        )
        fecha = request.query_params.get("fecha")

        base = SensadoAmbiental.objects.select_related(
            "circuito", "circuito__espacio"
        )

        if ctx["is_auth"]:
            # Usuario autenticado
            if not ctx["allowed_spaces"]:
                return Response({
                    "espacios": [],
                    "circuitos": [],
                    "fechas": [],
                    "horas": [],
                })

            espacios_qs = Espacio.objects.filter(
                id_espacios__in=ctx["allowed_spaces"]
            ).order_by("id_espacios")

        else:
            espacios_qs = Espacio.objects.all().order_by("id_espacios")

        espacios_ids = list(
            espacios_qs.values_list("id_espacios", flat=True)
        )

        espacios = [
            {
                "id": e.id_espacios,
                "nombre": e.nombre_espacio or f"Espacio #{e.id_espacios}",
            }
            for e in espacios_qs
        ]

        # =========================
        # CIRCUITOS AMBIENTALES
        # =========================
        if id_esp is not None:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios=id_esp,
                tipo__id_tipo_circuito=TIPO_AMBIENTAL,
            )
        else:
            circuits_qs = Circuito.objects.filter(
                espacio__id_espacios__in=espacios_ids,
                tipo__id_tipo_circuito=TIPO_AMBIENTAL,
            )

        circuitos = list(
            circuits_qs.values_list("bluetooth", flat=True)
            .distinct()
            .order_by("bluetooth")
        )

        # =========================
        # FECHAS
        # =========================
        if circuito_bt:
            qs_fechas = base.filter(circuito__bluetooth=circuito_bt)
        else:
            qs_fechas = base.filter(circuito__bluetooth__in=circuitos)

        fechas_qs = (
            qs_fechas
            .annotate(d=TruncDate("FechaSensado"))
            .values_list("d", flat=True)
            .distinct()
            .order_by("-d")
        )

        fechas = [d.isoformat() for d in fechas_qs]

        # =========================
        # HORAS
        # =========================
        qs_horas = qs_fechas
        if fecha:
            qs_horas = qs_horas.filter(FechaSensado__date=fecha)

        horas_times = (
            qs_horas
            .annotate(h=TruncTime("FechaSensado"))
            .values_list("h", flat=True)
            .distinct()
            .order_by("h")
        )

        horas = [
            t.strftime("%H:%M") if hasattr(t, "strftime") else str(t)[:5]
            for t in horas_times
        ]

        return Response({
            "espacios": espacios,
            "circuitos": circuitos,
            "fechas": fechas,
            "horas": horas,
        })

class DatosAmbientalesView(APIView):
    """
    GET /api/monitoreo/ambiental/

    - Público: último registro global
    - Autenticado sin espacios: []
    - Autenticado con espacios: últimos N del usuario
    """

    def get(self, request):
        ctx = _user_ctx(request)
        qs = SensadoAmbiental.objects.select_related("circuito", "circuito__espacio")

        if not ctx["is_auth"]:
            data = SensadoAmbientalSerializer(
                qs.order_by("-FechaSensado")[:1], many=True
            ).data
            return Response(data)

        if not ctx["allowed_spaces"]:
            return Response([], status=200)

        limit, since_dt = _role_limits(True)

        qs = qs.filter(
            FechaSensado__gte=since_dt,
            circuito__espacio__id_espacios__in=ctx["allowed_spaces"],
            circuito__tipo__id_tipo_circuito=TIPO_AMBIENTAL,
        )

        data = SensadoAmbientalSerializer(
            qs.order_by("-FechaSensado")[:limit], many=True
        ).data

        return Response(data)

