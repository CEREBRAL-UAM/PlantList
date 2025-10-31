from .models import *
from .serializers import *
from .base import RolModelViewSet, RolAPIView
from rest_framework.response import Response
from django.db import connection
from datetime import datetime

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
    
class ExperimentoTactoView(RolModelViewSet):
    serializer_class = ExperimentoTactoSerializer

    def get_queryset(self):
        user_id = getattr(self.request.user, "pk", None)
        base = ExperimentoTacto.objects.all()
        if not user_id:
            return base.none()
        return base.filter(id_Usuario=user_id).order_by("-Fecha_Sensado", "-id_ExperimentoTacto")


class ExperimentoProximidadView(RolModelViewSet):
    serializer_class = ExperimentoProximidadSerializer

    def get_queryset(self):
        user_id = getattr(self.request.user, "pk", None)
        base = ExperimentoProximidad.objects.all()
        if not user_id:
            return base.none()
        return base.filter(id_Usuario=user_id).order_by("-Fecha_Sensado", "-id_ExperimentoProximidad")

# Busqueda 
def _parse_date_or_none(q: str):
    if not q:
        return None
    q = q.strip()
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(q, fmt).date()
        except ValueError:
            continue
    return None

class GestionExperimentosView(RolAPIView):
    """
    GET /api/experimentos/apiv1/gestion/?q=&limit=&offset=
    - Restringe SIEMPRE a los experimentos del usuario autenticado.
    - Busca por: fecha (exacta si q es fecha), espacio (LIKE), tipo (LIKE).
    """
    def get(self, request):
        q = request.query_params.get("q", "") or ""
        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")

        # Id del usuario actual 
        user_id = getattr(request.user, "pk", None)
        if not user_id:
            return Response({"results": [], "limit": 0, "offset": 0, "count": 0})

        like = f"%{q.strip().lower()}%" if q else None
        date_q = _parse_date_or_none(q)

        # WHERE base: SIEMPRE limitar por usuario
        where_clauses = ["t.id_usuario = %s"]
        params = [user_id]

        # Agregar criterios de búsqueda (OR group)
        ors = []
        if like:
            ors.append("LOWER(t.espacio_nombre) LIKE %s"); params.append(like)
            ors.append("LOWER(t.tipo) LIKE %s");           params.append(like)
            ors.append("DATE_FORMAT(t.fecha, '%%d/%%m/%%Y') LIKE %s"); params.append(like)

        if date_q is not None:
            ors.append("t.fecha = %s"); params.append(date_q)

        where_sql = "WHERE " + " AND ".join(where_clauses)
        if ors:
            where_sql += " AND (" + " OR ".join(ors) + ")"

        sql = f"""
        SELECT t.id_experimento, t.tipo, t.fecha, t.espacio_id, t.espacio_nombre
        FROM (
            SELECT
                et.id_ExperimentoTacto      AS id_experimento,
                'Tacto'                     AS tipo,
                et.Fecha_Sensado            AS fecha,
                et.id_espacios              AS espacio_id,
                e.nombre_espacio            AS espacio_nombre,
                et.id_Usuario               AS id_usuario
            FROM bd_ipc.experimentotacto et
            JOIN bd_ipc.espacios e ON e.id_espacios = et.id_espacios

            UNION ALL

            SELECT
                ep.id_ExperimentoProximidad AS id_experimento,
                'Proximidad'                AS tipo,
                ep.Fecha_Sensado            AS fecha,
                ep.id_espacios              AS espacio_id,
                e2.nombre_espacio           AS espacio_nombre,
                ep.id_Usuario               AS id_usuario
            FROM bd_ipc.experimentoproximidad ep
            JOIN bd_ipc.espacios e2 ON e2.id_espacios = ep.id_espacios
        ) AS t
        {where_sql}
        ORDER BY t.fecha DESC, t.id_experimento DESC
        """

        # Paginación simple (opcional)
        lim = 50
        off = 0
        try:
            if limit: lim = max(1, min(int(limit), 200))
        except: pass
        try:
            if offset: off = max(0, int(offset))
        except: pass

        sql += " LIMIT %s OFFSET %s"
        params.extend([lim, off])

        with connection.cursor() as cur:
            cur.execute(sql, params)
            cols = [c[0] for c in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]

        return Response({"results": rows, "limit": lim, "offset": off, "count": len(rows)})