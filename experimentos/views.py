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
    
class ExperimentoView(RolModelViewSet):
    serializer_class = ExperimentoSerializer

    def get_queryset(self):
        user_id = getattr(self.request.user, "pk", None)
        base = Experimento.objects.all()
        if not user_id:
            return base.none()
        return base.filter(id_Usuario=user_id).order_by("-Fecha_Sensado", "-id_Experimento")

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
    def get(self, request):
        q = request.query_params.get("q", "") or ""
        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")

        user_id = getattr(request.user, "pk", None)
        if not user_id:
            return Response({"results": [], "limit": 0, "offset": 0, "count": 0})

        like = f"%{q.strip().lower()}%" if q else None
        date_q = _parse_date_or_none(q)

        # WHERE base por usuario
        where_clauses = ["ex.id_Usuario = %s"]
        params = [user_id]

        # ORs para búsqueda libre
        ors = []
        if like:
            # espacio
            ors.append("LOWER(e.nombre_espacio) LIKE %s"); params.append(like)
            # tipo de estimulación
            ors.append("LOWER(es.nombre) LIKE %s"); params.append(like)
            # fecha con formato
            ors.append("DATE_FORMAT(ex.Fecha_Sensado, '%%d/%%m/%%Y') LIKE %s"); params.append(like)
            # horas inicio/fin
            ors.append("TIME_FORMAT(ex.Hora_inicio, '%%H:%%i') LIKE %s"); params.append(like)
            ors.append("TIME_FORMAT(ex.Hora_fin, '%%H:%%i') LIKE %s"); params.append(like)

        if date_q is not None:
            ors.append("ex.Fecha_Sensado = %s"); params.append(date_q)

        where_sql = "WHERE " + " AND ".join(where_clauses)
        if ors:
            where_sql += " AND (" + " OR ".join(ors) + ")"

        # SQL directo sin subconsulta
        sql = f"""
        SELECT
            ex.id_Experimento           AS id_experimento,
            ex.id_TipoEstimulacion      AS id_estimulacion,
            es.nombre                   AS tipo_estimulacion,
            ex.Fecha_Sensado            AS fecha,
            ex.Hora_inicio              AS inicio,
            ex.Hora_fin                 AS fin,
            ex.id_espacios              AS espacio_id,
            e.nombre_espacio            AS espacio_nombre
        FROM bd_ipc.experimento ex
        LEFT JOIN bd_ipc.espacios e 
               ON e.id_espacios = ex.id_espacios
        LEFT JOIN bd_ipc.tipoestimulacion es 
               ON es.id_TipoEstimulacion = ex.id_TipoEstimulacion
        {where_sql}
        ORDER BY ex.Fecha_Sensado DESC, ex.id_Experimento DESC
        """

        # Paginación
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

class CircuitosPorEspacioView(RolAPIView):
    def get(self, request):
        espacio_id = request.query_params.get("espacioId")
        if not espacio_id:
            return Response({"results": []})

        sql = """
            SELECT 
                c.id_Circuito   AS id_circuito,
                c.bluetooth      AS bluetooth,
                tc.descripcion   AS tipo
            FROM bd_ipc.circuito c
            LEFT JOIN bd_ipc.tipoCircuitos tc
              ON tc.id_circuito = c.tipo_circuito
            WHERE c.id_espacios = %s
            ORDER BY c.id_Circuito ASC
        """
        with connection.cursor() as cur:
            cur.execute(sql, [espacio_id])
            cols = [c[0] for c in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        return Response({"results": rows})