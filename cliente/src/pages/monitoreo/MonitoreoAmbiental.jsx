import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getDatosAmbientales,
  getHistoricosFacets,
  getAmbientalRango,
} from "../../api/monitoreo.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { Link } from "react-router-dom";

/* ================= helpers ================= */
function parseBoolMaybe(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  return false;
}
function getTokenFromStorage() {
  const keys = [
    "authToken",
    "token",
    "Token",
    "access",
    "key",
    "apiToken",
    "authorization",
    "Authorization",
    "TokenUsuario",
  ];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v.replace(/^Token\s+/i, "").trim();
  }
  return null;
}
function getUserFromStorage() {
  const keys = ["authUser", "user", "usuario", "currentUser", "me", "userInfo"];
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") return obj;
    } catch {}
  }
  return null;
}

function composeDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const [hh = "00", mm = "00"] = String(timeStr).split(":");

  return `${dateStr}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
}
const SERVER_TIMEZONE = "America/Mexico_City";

function buildRangeStrings(fechaIni, horaIni, fechaFin, horaFin) {
  return {
    start_send: `${fechaIni}T${horaIni}:00`,
    end_send: `${fechaFin}T${horaFin}:00`,
  };
}

function coerceNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function rowDate(r) {
  const s =
    r?.fechaSensado ??
    r?.FechaSensado ??
    r?.fecha ??
    r?.timestamp ??
    r?.created_at;

  console.log("FECHA RAW:", s);

  const d = new Date(s);

  console.log("DATE:", d);

  return isNaN(d) ? null : d;
}

function displayDateTime(d) {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function useContainerWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, Math.max(320, w)];
}

function formatTick(dt) {
  const d = dt instanceof Date ? dt : new Date(dt);
  if (isNaN(d)) return "";
  const fDate = d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
  });
  const fTime = d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fDate} ${fTime}`;
}
const palette = {
  TempAmbiental: {
    color: "rgb(175, 170, 190)",
    chip: "Temp",
  },
  Humedad: {
    color: "rgb(107, 135, 121)", 
    chip: "Humedad",
  },
  Lux: {
    color: "rgb(225, 210, 175)", 
    chip: "Lux",
  },
  Radiacion: {
    color: "rgb(189, 156, 137)", 
    chip: "Radiación",
  },
  Luz_Azul: {
    color: "rgb(161, 197, 191)",
    chip: "Luz Azul",
  },
  Luz_Blanca: {
    color: "rgb(180, 180, 180)", 
    chip: "Luz Blanca",
  },
  Luz_Roja: {
    color: "rgb(195, 145, 140)", 
    chip: "Luz Roja",
  },
  Voltaje: {
    color: "rgb(230, 165, 140)", 
    chip: "Voltaje",
  },
  Amperaje: {
    color: "rgb(177, 203, 168)",
    chip: "Amperaje",
  },
  HumedadSuelo: {
    color: "rgb(220, 175, 185)",
    chip: "Humedad Suelo",
  },
};


const metricKeys = Object.keys(palette);

function MultiLineChart({
  seriesMap,
  activeKeys,
  labels,
  height = 360,
  yTicks = 5,
  rightAxisTicks = null,
}) {
  const padding = { top: 16, right: 32, bottom: 64, left: 56 };
  const [wrapRef, width] = useContainerWidth();
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const allValues = [];
  activeKeys.forEach((k) =>
    (seriesMap[k] || []).forEach((v) => Number.isFinite(v) && allValues.push(v))
  );
  const arr = allValues.length ? allValues : [0];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const span = max - min || 1;

  const maxLen = Math.max(
    labels?.length || 0,
    ...metricKeys.map((k) => seriesMap[k]?.length || 0)
  );
  const xAt = (i) => padding.left + (i / Math.max(1, maxLen - 1)) * w;
  const yAt = (v) => padding.top + (1 - (v - min) / span) * h;

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => i);
  const yLabels = ticks.map((t) => {
    const v = min + (1 - t / yTicks) * span;
    const p = span >= 10 ? 0 : span >= 1 ? 1 : 2;
    return Number(v.toFixed(p));
  });

  const xCount = Math.min(12, maxLen || 1);
  const xIdxs = Array.from(
    { length: xCount },
    (_, i) => Math.round(((i / (xCount - 1 || 1)) * (maxLen - 1)) || 0)
  );

  const plotRightX = padding.left + w;

  return (
    <div ref={wrapRef} className="w-full">
      <svg width={width} height={height}>
        {/* grid + eje izquierdo */}
        {ticks.map((t, i) => {
          const y = padding.top + (t / yTicks) * h;
          return (
            <g key={`gy-${i}`}>
              <line
                x1={padding.left}
                x2={plotRightX}
                y1={y}
                y2={y}
                stroke="#E5E7EB"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#6B7280"
              >
                {yLabels[i]}
              </text>
            </g>
          );
        })}

        {/* eje X */}
        <line
          x1={padding.left}
          x2={plotRightX}
          y1={padding.top + h}
          y2={padding.top + h}
          stroke="#9CA3AF"
        />
        {xIdxs.map((i, ix) => {
          const x = xAt(i);
          const y = padding.top + h;
          const lbl = labels?.[i] ? formatTick(labels[i]) : "";
          return (
            <g key={`gx-${ix}`}>
              <line x1={x} x2={x} y1={y} y2={y + 4} stroke="#9CA3AF" />
              <text
                transform={`translate(${x}, ${y + 8}) rotate(-90)`}
                textAnchor="end"
                fontSize="10"
                fill="#6B7280"
              >
                {lbl}
              </text>
            </g>
          );
        })}

        {Array.isArray(rightAxisTicks) && rightAxisTicks.length > 0 && (
          <>
            <line
              x1={plotRightX}
              x2={plotRightX}
              y1={padding.top}
              y2={padding.top + h}
              stroke="#D1D5DB"
              strokeDasharray="2 2"
            />
            {rightAxisTicks.map((v, i) => {
              if (!Number.isFinite(v)) return null;
              let y = yAt(v);

              const yMin = padding.top;
              const yMax = padding.top + h;
              if (y < yMin) y = yMin;
              if (y > yMax) y = yMax;

              return (
                <g key={`ry-${i}`}>
                  <line
                    x1={plotRightX}
                    x2={plotRightX + 4}
                    y1={y}
                    y2={y}
                    stroke="#9CA3AF"
                  />
                  <text
                    x={plotRightX + 8}
                    y={y + 3}
                    fontSize="9"
                    fill="#6B7280"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* series */}
        {metricKeys.map((key) => {
          if (!activeKeys.has(key)) return null;
          const data = seriesMap[key] || [];
          if (!data.length) return null;
          const d = data
            .map((v, i) => `${i ? "L" : "M"} ${xAt(i)} ${yAt(v)}`)
            .join(" ");
          return (
            <path
              key={key}
              d={d}
              fill="none"
              stroke={palette[key].color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ================= componente ================= */
export function MonitoreoAmbiental() {
  const user = getUserFromStorage();
  const role = (user?.Rol || user?.rol || user?.role || "")
    .toString()
    .toLowerCase();
  const isAdmin =
    parseBoolMaybe(user?.isAdmin) ||
    parseBoolMaybe(user?.esAdmin) ||
    parseBoolMaybe(user?.is_admin);
  const token = getTokenFromStorage();
  const hasAccess = Boolean(isAdmin || role === "admin" || token);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [noSpaces, setNoSpaces] = useState(false);

  //Datos públicos
  const [datosPublic, setDatosPublic] = useState([]);
  const ultimoPublic = datosPublic?.[0] ?? null;

  const [resumen, setResumen] = useState(null);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState({
    TempAmbiental: [],
    Humedad: [],
    Lux: [],
    Radiacion: [],
    Luz_Azul: [],
    Luz_Blanca: [],
    Luz_Roja: [],
    Voltaje: [],
    Amperaje: [],
    HumedadSuelo: [],
  });
  const [activeKeys, setActiveKeys] = useState(new Set(metricKeys));
  const [rangeMode, setRangeMode] = useState(false);
  const voltAxisTicks = [0, 0.5, 1];

  // Facets
  const [espacios, setEspacios] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [fechasIni, setFechasIni] = useState([]);
  const [fechasFin, setFechasFin] = useState([]);
  const [fechasIniBase, setFechasIniBase] = useState([]);
  const [fechasFinBase, setFechasFinBase] = useState([]);
  const [horasIni, setHorasIni] = useState([]);
  const [horasFin, setHorasFin] = useState([]);

  const [idEspacio, setIdEspacio] = useState("");
  const [idCircuito, setIdCircuito] = useState("");
  const [fechaIni, setFechaIni] = useState("");
  const [horaIni, setHoraIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const POLL_MS = 1000;
  const HISTORY_LEN = 80;

  const resumenEspacioNombre = useMemo(() => {
    if (!resumen?.id_espacios) return "—";
    const esp = espacios.find(
      (e) =>
        String(e.id ?? e.id_espacios) === String(resumen.id_espacios)
    );
    if (!esp) return `Espacio #${resumen.id_espacios}`;
    return (
      esp.nombre ??
      esp.nombre_espacio ??
      `Espacio #${resumen.id_espacios}`
    );
  }, [resumen, espacios]);

  const onEspacio = async (v) => {
    setIdEspacio(v);
    setIdCircuito("");
    setFechaIni("");
    setHoraIni("");
    setFechaFin("");
    setHoraFin("");
    setFechasIni([]);
    setFechasFin([]);
    setHorasIni([]);
    setHorasFin([]);
    setFechasIniBase([]);
    setFechasFinBase([]);
    try {
      const { data } = await getHistoricosFacets({ 
        id_espacios: Number(v),
      });
      setCircuitos(data?.circuitos || []);
      const fechas = data?.fechas || [];
      setFechasIni(fechas);
      setFechasFin(fechas);
      setFechasIniBase(fechas);
      setFechasFinBase(fechas);
    } catch {
      setCircuitos([]);
    }
  };
  const onCircuito = async (v) => {
    setIdCircuito(v);
    setFechaIni("");
    setHoraIni("");
    setFechaFin("");
    setHoraFin("");
    setHorasIni([]);
    setHorasFin([]);
    try {
      const { data } = await getHistoricosFacets({ bluetooth: v });
      const fechas = data?.fechas || [];
      setFechasIni(fechas);
      setFechasFin(fechas);
      setFechasIniBase(fechas);
      setFechasFinBase(fechas);
    } catch {
      setFechasIni([]);
      setFechasFin([]);
      setFechasIniBase([]);
      setFechasFinBase([]);
    }
  };
  const onFechaIni = async (v) => {
    setFechaIni(v);
    setHoraIni("");
    setFechasFin((fechasFinBase || []).filter((d) => d >= v));
    try {
      const { data } = await getHistoricosFacets({
        bluetooth: idCircuito,
        fecha: v,
      });
      setHorasIni(data?.horas || []);
    } catch {
      setHorasIni([]);
    }
  };
  const onFechaFin = async (v) => {
    setFechaFin(v);
    setHoraFin("");
    try {
      const { data } = await getHistoricosFacets({
        bluetooth: idCircuito,
        fecha: v,
      });
      let horas = data?.horas || [];
      if (fechaIni && v === fechaIni && horaIni)
        horas = horas.filter((h) => h >= horaIni);
      setHorasFin(horas);
    } catch {
      setHorasFin([]);
    }
  };
  useEffect(() => {
    if (!hasAccess) return;
    if (!idCircuito || !fechaIni || !fechaFin || fechaIni !== fechaFin) return;
    (async () => {
      try {
        const { data } = await getHistoricosFacets({
          bluetooth: idCircuito,
          fecha: fechaFin,
        });
        let horas = data?.horas || [];
        if (horaIni) horas = horas.filter((h) => h >= horaIni);
        setHorasFin(horas);
      } catch {
        setHorasFin([]);
      }
    })();
  }, [horaIni, hasAccess, idCircuito, fechaIni, fechaFin]);

  const ready = useMemo(() => {
    if (
      !(
        hasAccess &&
        idEspacio &&
        idCircuito &&
        fechaIni &&
        horaIni &&
        fechaFin &&
        horaFin
      )
    )
      return false;
    const dIni = composeDateTime(fechaIni, horaIni);
    const dFin = composeDateTime(fechaFin, horaFin);
    return Boolean(dIni && dFin && dFin >= dIni);
  }, [hasAccess, idEspacio, idCircuito, fechaIni, horaIni, fechaFin, horaFin]);

  const consultar = async () => {
    setError("");
    setStatus("");
    if (!ready) {
      setStatus("Completa todos los filtros y verifica el rango.");
      return;
    }
    if (!token) {
      setStatus("Necesitas iniciar sesión para consultar por rango.");
      return;
    }

    setRangeMode(true);
    setLoading(true);

    try {
      const { start_send, end_send } = buildRangeStrings(
        fechaIni,
        horaIni,
        fechaFin,
        horaFin
      );

      const payloadBase = {
        id_espacios: Number.isFinite(Number(idEspacio))
          ? Number(idEspacio)
          : idEspacio,
        bluetooth: idCircuito,
      };

      const attempts = [
        { ...payloadBase, start: start_send, end: end_send },
        {
          id_espacios: payloadBase.id_espacios,
          bluetooth: payloadBase.bluetooth,
          start: start_send,
          end: end_send,
        },
        { ...payloadBase, fecha_inicio: fechaIni, fecha_fin: fechaFin },
      ];

      let ambList = [];
      for (let i = 0; i < attempts.length; i++) {
        try {
          const { data } = await getAmbientalRango(attempts[i]);
          const raw = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : [];
          if (raw.length) {
            ambList = raw;
            break;
          }
        } catch {}
      }

      if (!ambList.length) {
        setStatus("Sin datos para el rango seleccionado.");
        setSeries({
          TempAmbiental: [],
          Humedad: [],
          Lux: [],
          Radiacion: [],
          Luz_Azul: [],
          Luz_Blanca: [],
          Luz_Roja: [],
          Voltaje: [],
          Amperaje: [],
          HumedadSuelo: [],
        });
        setResumen(null);
        setLabels([]);
        return;
      }

      const rows = ambList
        .map((r) => ({ r, d: rowDate(r) }))
        .filter((x) => x.d)
        .sort((a, b) => a.d - b.d)
        .map(({ r, d }) => ({ ...r, __d: d }));

      setLabels(rows.map((r) => r.__d));

      const next = {};
      [
        "TempAmbiental",
        "Humedad",
        "Lux",
        "Radiacion",
        "Luz_Azul",
        "Luz_Blanca",
        "Luz_Roja",
        "Voltaje",
        "Amperaje",
        "HumedadSuelo",
      ].forEach((k) => {
        next[k] = rows.map((r) => {
          const n = Number(r?.[k]);
          return Number.isFinite(n) ? n : 0;
        });
      });

      setSeries((prev) => ({ ...prev, ...next }));

      const last = rows[rows.length - 1];
      setResumen(
        last
          ? {
              fecha: last.__d,
              bluetooth: last.bluetooth,
              id_espacios: last.id_espacios ?? null,
            }
          : null
      );

      setStatus("");
    } catch (e) {
      setError(e?.message || "Error no controlado en la consulta de rango.");
    } finally {
      setLoading(false);
    }
  };

  const descargarCSVAmbiental = async () => {
    if (!ready) {
      setStatus("Primero realiza una búsqueda válida.");
      return;
  }

  const { start_send, end_send } = buildRangeStrings(
    fechaIni,
    horaIni,
    fechaFin,
    horaFin
  );

  console.log("START: ", start_send);
  console.log("END: ", end_send);

  const params = new URLSearchParams({
    id_espacios: idEspacio,
    bluetooth: idCircuito,
    start: start_send,
    end: end_send,
    download: "csv",
  });

  const url = `http://127.0.0.1:8000/api/monitoreo/sensadoambiental/rango/?${params.toString()}&t=${Date.now()}`;

  console.log("URL FINAL:", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      throw new Error("Error en descarga");
    }

    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `historial_ambiental_${Date.now()}.csv`;
    link.click();

  } catch (err) {
    console.error(err);
  }
};

  const limpiar = () => {
    setRangeMode(false);
    setIdEspacio("");
    setIdCircuito("");
    setFechaIni("");
    setHoraIni("");
    setFechaFin("");
    setHoraFin("");
    setFechasIni([]);
    setFechasFin([]);
    setHorasIni([]);
    setHorasFin([]);
    setFechasIniBase([]);
    setFechasFinBase([]);
    setSeries({
      TempAmbiental: [],
      Humedad: [],
      Lux: [],
      Radiacion: [],
      Luz_Azul: [],
      Luz_Blanca: [],
      Luz_Roja: [],
      Voltaje: [],
      Amperaje: [],
      HumedadSuelo: [],
    });
    setResumen(null);
    setLabels([]);
    setActiveKeys(new Set(metricKeys));
    setStatus("");
    setError("");
  };

  async function tickLive(seed = false) {
  try {

    const ambRes = await getDatosAmbientales();

    const ambRaw = Array.isArray(ambRes?.data)
      ? ambRes.data
      : Array.isArray(ambRes?.data?.results)
      ? ambRes.data.results
      : [];

    ambRaw.sort((a, b) => {

      const da = new Date(
        a.FechaSensado ??
        a.fechaSensado ??
        a.fecha
      );

      const db = new Date(
        b.FechaSensado ??
        b.fechaSensado ??
        b.fecha
      );

      return (db?.getTime?.() ?? 0) - (da?.getTime?.() ?? 0);
    });

    const ambFuente = idCircuito
      ? ambRaw.filter(
          (r) =>
            String(
              r.bluetooth ??
              r.id_bluetooth ??
              r.id_Circuito
            ) === String(idCircuito)
        )
      : ambRaw;

    const lastAmb = ambFuente[0];

    if (lastAmb) {

      const d = new Date(
        lastAmb.FechaSensado ??
        lastAmb.fechaSensado ??
        lastAmb.fecha
      );

      setResumen({
        fecha: d,

        bluetooth:
          lastAmb.bluetooth ??
          lastAmb.id_bluetooth ??
          lastAmb.id_Circuito,

        descripcion:
          lastAmb.nombre_espacio ??
          lastAmb.descripcion ??
          "Sin espacio",

        id_espacios:
          lastAmb.id_espacios ?? null,
      });

    } else {

      setResumen(null);
    }

    if (seed) {

      const ambRows = ambFuente
        .slice(0, HISTORY_LEN)
        .reverse()
        .map((r) => ({
          r,

          d: new Date(
            r.FechaSensado ??
            r.fechaSensado ??
            r.fecha
          ),
        }))
        .filter((x) => !isNaN(x.d));

      setLabels(
        ambRows.map((x) => x.d)
      );

      const next = {};

      [
        "TempAmbiental",
        "Humedad",
        "Lux",
        "Radiacion",
        "Luz_Azul",
        "Luz_Blanca",
        "Luz_Roja",
        "Voltaje",
        "Amperaje",
        "HumedadSuelo",
      ].forEach((k) => {

        next[k] = ambRows
          .map((it) => Number(it.r?.[k]))
          .filter(Number.isFinite);
      });

      setSeries(next);

    } else {

      const uAmb = ambFuente[0];

      if (!uAmb) {
        setLoading(false);
        return;
      }

      setLabels((prev) => {

        const raw =
          uAmb?.FechaSensado ??
          uAmb?.fechaSensado ??
          uAmb?.fecha;

        const d = new Date(raw);

        if (isNaN(d)) return prev;

        const n = [...prev, d];

        if (n.length > HISTORY_LEN)
          n.shift();

        return n;
      });

      setSeries((prev) => {

        const next = { ...prev };

        const pushVal = (k, v) => {

          const arr = [...(next[k] || [])];

          arr.push(
            Number.isFinite(v)
              ? v
              : arr[arr.length - 1] ?? 0
          );

          if (arr.length > HISTORY_LEN)
            arr.shift();

          next[k] = arr;
        };

        [
          "TempAmbiental",
          "Humedad",
          "Lux",
          "Radiacion",
          "Luz_Azul",
          "Luz_Blanca",
          "Luz_Roja",
          "Voltaje",
          "Amperaje",
          "HumedadSuelo"
        ].forEach((k) =>
          pushVal(k, Number(uAmb?.[k]))
        );

        return next;
      });
    }

    setLoading(false);

  } catch (e) {

    console.error(
      "Error en tickLive ambiental:",
      e
    );

    setLoading(false);
  }
}

useEffect(() => {
  if (hasAccess) return;

  let alive = true;

  (async () => {
    try {
      const res = await getDatosAmbientales();

      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];

      if (!alive) return;

      setDatosPublic(raw);

    } catch (e) {
      console.error("Error cargando ambiental público", e);

    } finally {

      if (alive) setLoading(false);

    }
  })();

  return () => {
    alive = false;
  };

}, [hasAccess]);

/* ===== DATOS PÚBLICOS ===== */
useEffect(() => {

  if (hasAccess) return;

  let alive = true;

  (async () => {

    try {

      setLoading(true);

      const res =
        await getDatosAmbientales();

      const raw = Array.isArray(
        res?.data
      )
        ? res.data
        : Array.isArray(
            res?.data?.results
          )
        ? res.data.results
        : [];

      if (!alive) return;

      setDatosPublic(raw);

    } catch (e) {

      console.error(
        "Error cargando ambiental público",
        e
      );

      if (!alive) return;

      setDatosPublic([]);

    } finally {

      if (alive)
        setLoading(false);

    }

  })();

  return () => {
    alive = false;
  };

}, [hasAccess]);



/* ===== FACETS PRIVADOS ===== */
useEffect(() => {

  if (!token) return;

  let alive = true;

  (async () => {

    try {

      setLoading(true);

      const { data } =
        await getHistoricosFacets({});

      if (!alive) return;

      const esp =
        data?.espacios || [];

      setEspacios(esp);

      setNoSpaces(
        esp.length === 0
      );

      setCircuitos(
        data?.circuitos || []
      );

    } catch (e) {

      console.error(
        "Error cargando facets:",
        e
      );

      if (!alive) return;

      setEspacios([]);

      setCircuitos([]);

      setNoSpaces(true);

    } finally {

      if (alive)
        setLoading(false);

    }

  })();

  return () => {
    alive = false;
  };

}, [token]);



/* ===== DATOS EN VIVO ===== */
useEffect(() => {

  if (!hasAccess || noSpaces)
    return;

  if (rangeMode)
    return;

  tickLive(true);

  const t = setInterval(
    () => tickLive(false),
    POLL_MS
  );

  return () => clearInterval(t);

}, [
  hasAccess,
  rangeMode,
  idCircuito,
  noSpaces
]);

useEffect(() => {

  if (!token) return;

  let alive = true;

  (async () => {

    try {

      const { data } =
        await getHistoricosFacets({});

      if (!alive) return;

      const esp = data?.espacios || [];

      setEspacios(esp);

      setNoSpaces(esp.length === 0);

      setCircuitos(
        data?.circuitos || []
      );

    } catch (e) {

      console.error(
        "Error cargando facets:",
        e
      );

      if (!alive) return;

      setEspacios([]);

      setCircuitos([]);

      setNoSpaces(true);

    } finally {

      if (alive)
        setLoading(false);
    }

  })();

  return () => {
    alive = false;
  };

}, [token]);



  const toggleKey = (k) => {
    setActiveKeys((prev) => {
      const s = new Set(prev);
      s.has(k) ? s.delete(k) : s.add(k);
      return s;
    });
  };
  

  return (
    <div
      className="px-6 pt-6 pb-10 min-h-screen bg-[#fbf6f2]"
      style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
    >
      <BannerUsuario />
      <h1 className="text-xl font-extrabold text-center text-[#2e5d32]">
        MONITOREO AMBIENTAL
      </h1>

      {/* ================= VISTA PÚBLICA ================= */}
      {!hasAccess && (
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300 text-xl mt-8">
              Cargando datos...
            </p>
          ) : !ultimoPublic ? (
            <p className="text-center text-gray-600 dark:text-gray-300 text-xl mt-8">
              No hay datos disponibles.
            </p>
          ) : (
            <>
              {/* Tarjeta con info general */}
              <div className="max-w-md mx-auto mt-8 p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: "rgb(235, 229, 223)" }}>
                
                {/* Espacio */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Id.png" alt="Espacio" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Espacio:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.nombre_espacio ?? (ultimoPublic.id_espacios ? `Espacio #${ultimoPublic.id_espacios}` : "—")}
                  </span>
                </div>
                
                {/* Fecha */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Date.png" alt="Fecha" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Fecha:</strong>
                  </div>
                <span style={{ color: "rgb(83, 79, 79)" }}>
                  {ultimoPublic.FechaSensado ? displayDateTime(ultimoPublic.FechaSensado) : "—"}
                </span>
              </div>

                {/* Circuito */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Bluetooth.png" alt="Bluetooth" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Circuito:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.bluetooth ?? ultimoPublic.id_bluetooth ?? ultimoPublic.id_Circuito ?? "—"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow"
                  style={{ backgroundColor: "rgb(175, 170, 190" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold text-white">
                    <img src="/images/iconos/Temp.png" alt="Temp" className="w-6 h-6" />
                    Temp
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.TempAmbiental ?? "—"} °C
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(107, 135, 121)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/HumedadA.png" alt="Humedad" className="w-6 h-6" />
                    Humedad
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Humedad ?? "—"} %
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(225, 210, 175)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/Lux.png" alt="lux" className="w-6 h-6" />
                    Lux
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Lux ?? "—"} lx
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(189, 156, 137)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/Radiacion.png"alt="Radiación" className="w-6 h-6" />
                    Radiación
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Radiacion ?? "—"} W/m²
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(161, 197, 191)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/LuzAzul.png" alt="Luz Azul" className="w-6 h-6" />
                    Luz Azul
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Luz_Azul ?? "—"} nm
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(180, 180, 180)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/luzBlanca.png" alt="Luz Blanca" className="w-6 h-6" />
                    Luz Blanca
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Luz_Blanca ?? "—"} nm
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(195, 145, 140)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/LuzRoja.png" alt="Luz Roja" className="w-6 h-6" />
                    Luz Roja
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Luz_Roja ?? "—"} nm
                  </span>
                </div>

                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow"
                  style={{ backgroundColor: "rgb(230, 165, 140)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold text-white">
                    <img src="/images/iconos/Voltaje.png" alt="Voltaje" className="w-6 h-6" />
                    Voltaje
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Voltaje ?? "—"} V
                  </span>
                </div>
                
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(177, 203, 168)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/Amperaje.png" alt="Amperaje" className="w-6 h-6" />
                    Amperaje
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.Amperaje ?? "—"} A
                  </span>
                </div>
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(220, 175, 185)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/Humedad.png" alt="Humedad Suelo" className="w-6 h-6" />
                    Humedad Suelo
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.HumedadSuelo ?? "—"} %
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= VISTA SUSCRIPTOR / ADMIN ================= */}
      {hasAccess && (
        <>
          {!loading && noSpaces ? (
            <div className="w-full mx-auto mt-10">
              <div className="min-h-[45vh] flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  No hay espacios registrados.
                </p>
                <p className="text-sm text-gray-600">
                  Ingresa un nuevo espacio para comenzar a visualizar tus
                  gráficas.
                </p>
                <Link
                  to="/biolink_ipc/AgregarEspacio"
                  className="group mt-4 flex flex-col items-center gap-3"
                >
                  <span className="grid place-items-center w-24 h-24 rounded-full bg-[#7bb59b] shadow-lg transition-transform group-hover:scale-105">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[#2e5d32] font-semibold">
                    Agregar espacio
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto mt-6 space-y-4">
              {/* FILTRAR DATOS */}
              <div className="bg-transparent">
                <div className="flex items-center gap-3 text-[#2e5d32] font-semibold mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#c8dcbc]">
                    <span className="w-3 h-3 border-t-2 border-b-2 border-[#2e5d32]" />
                  </span>
                  <span>Filtrar datos</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={String(idEspacio)}
                    onChange={(e) => onEspacio(e.target.value)}
                    disabled={noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">
                      {noSpaces ? "Sin espacios" : "Espacio"}
                    </option>
                    {espacios.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre ?? `Espacio #${e.id}`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={idCircuito}
                    onChange={(e) => onCircuito(e.target.value)}
                    disabled={!idEspacio || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Circuito (Bluetooth)</option>
                    {circuitos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={fechaIni}
                    onChange={(e) => onFechaIni(e.target.value)}
                    disabled={!idCircuito || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Fecha inicial</option>
                    {fechasIni.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>

                  <select
                    value={fechaFin}
                    onChange={(e) => onFechaFin(e.target.value)}
                    disabled={!fechaIni || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Fecha final</option>
                    {fechasFin.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>

                  <select
                    value={horaIni}
                    onChange={(e) => setHoraIni(e.target.value)}
                    disabled={!fechaIni || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] border border-[#cfe0c6] min-w-[140px]"
                  >
                    <option value="">Hora inicio</option>
                    {horasIni.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <select
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    disabled={!fechaFin || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] border border-[#cfe0c6] min-w-[140px]"
                  >
                    <option value="">Hora fin</option>
                    {horasFin.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2 ml-4">
                    <button 
                    type="button" 
                    onClick={consultar} 
                    disabled={!ready || noSpaces} 
                    className="flex items-center justify-center p-2.5 bg-[#3b7f4a] hover:bg-[#316b3f] disabled:bg-gray-100 disabled:opacity-40 text-white rounded-xl shadow-sm disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
                    title="Consultar"> 
                      <img src="/images/iconos/consultar.png" alt="Consultar" className="w-7 h-7"/> 
                    </button>
                    
                    <button 
                    onClick={limpiar} 
                    disabled={noSpaces}
                    className="flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:bg-transparent disabled:text-gray-300 transition-all duration-200" 
                    title="Limpiar">
                      <img src="/images/iconos/limpiarA.png" alt="Limpiar" className="w-7 h-7 opacity-50"/>
                    </button>

                    <button 
                    onClick={descargarCSVAmbiental} 
                    disabled={!ready} 
                    className="flex items-center justify-center p-2.5 bg-[#C2E3C8] hover:bg-[#B2D6B9] rounded-xl disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200" 
                    title="Descargar CSV"> 
                      <img src="/images/iconos/csv.png" alt="Descargar CSV" className="w-7 h-7"/> 
                    </button>


                  </div>
                </div>

                {(status || error) && (
                  <div className="text-xs mt-2">
                    {status && (
                      <p className="text-amber-700">{status}</p>
                    )}
                    {error && (
                      <p className="text-red-700">Error: {error}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Contenedor de Chips */}
              <div className="flex flex-wrap gap-3">
                {metricKeys
                .filter((k) => 
                  ["TempAmbiental", "Humedad", "Lux", "Radiacion", "Luz_Azul", "Luz_Blanca", "Luz_Roja", "Humedad", "HumedadSuelo"].includes(k))
                .map((k) => {
                  const active = activeKeys.has(k);
                  const iconoMap = {
                    TempAmbiental: "Temp",
                    Humedad: "HumedadA",
                    Lux: "Lux",
                    Radiacion: "Radiacion",
                    Luz_Azul: "LuzAzul",
                    Luz_Blanca: "luzBlanca",
                    Luz_Roja: "LuzRoja",
                    HumedadSuelo: "Humedad"
                };
                
                return (
                <button key={k} type="button" onClick={() => toggleKey(k)} 
                className={`flex items-center gap-3 rounded-full px-4 py-2 shadow-md transition-all border-2 ${
                  active ? "scale-100 opacity-100" 
                  : "scale-95 opacity-50 grayscale bg-[#f3f4f6] border-[#d1d5db]"
                }`}
                style={{
                  backgroundColor: active ? palette[k].color : undefined,
                  borderColor: active ? "rgba(255,255,255,0.4)" : "transparent",
                }}
                >
                  <img 
                  src={`/images/iconos/${iconoMap[k] || k}.png`} 
                  alt={k} 
                  className="w-6 h-6 object-contain"
                  />
                  <span className={`font-bold text-sm ${active ? "text-white" : "text-gray-600"}`}>
                    {palette[k].chip}
                  </span>
                </button>
                );
                })}
              </div>

              {/* GRÁFICA + BOTONES VOLTAJE/AMPERAJE + PANEL DERECHA */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_120px_290px] gap-6 items-start">
                {/* Columna izquierda: gráfica */}
                <div className="min-w-0">
                  {loading ? (
                    <p className="text-gray-700">Cargando…</p>
                  ) : (
                    <MultiLineChart
                      seriesMap={series}
                      activeKeys={activeKeys}
                      labels={labels}
                      rightAxisTicks={voltAxisTicks}
                    />
                  )}
                  <div className="mt-2 text-xs text-gray-600">
                    {rangeMode
                      ? "Mostrando datos por rango."
                      : "Modo en vivo (últimos datos)."}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                  {metricKeys
                  .filter((k) => ["Voltaje", "Amperaje"].includes(k))
                  .map((k) => {
                    const active = activeKeys.has(k);
                    return (
                    <button
                    key={k}
                    type="button"
                    onClick={() => toggleKey(k)}
                    className={`flex items-center gap-3 rounded-full px-4 py-2 min-w-[130px] shadow-md transition-all border-2 ${
                      active ? "scale-100 opacity-100" : "scale-95 opacity-50 grayscale bg-[#f3f4f6] border-[#d1d5db]"
                    }`}
                    style={{
                      backgroundColor: active ? palette[k].color : undefined,
                      borderColor: active ? "rgba(255,255,255,0.4)" : "transparent",
                    }}
                    >
                      <img 
                      src={`/images/iconos/${k}.png`} 
                      alt={k} 
                      className="w-6 h-6 object-contain" 
                      />
                      <span className={`font-bold text-sm ${active ? "text-white" : "text-gray-600"}`}>
                        {palette[k].chip}
                      </span>
                    </button>
                    );
                    })}
                  </div>

                {/* tarjeta de datos */}
                <aside className="bg-[#f4efe9] border border-[#e3dbd3] rounded-xl shadow p-5">
                  <div className="space-y-3 text-sm">
        
                    {/* Espacio */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Id.png" alt="Espacio" className="w-5 h-5" />
                        <span className="font-semibold text-[#2e5d32]">
                          Espacio
                        </span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumenEspacioNombre}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Date.png" alt="Fecha" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">
                          Fecha
                        </span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumen ? displayDateTime(resumen.fecha) : "—"}
                      </span>
                    </div>

                    {/* Circuito */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img 
                          src="/images/iconos/Bluetooth.png"
                          alt="Bluetooth"
                          className="w-5 h-5"
                        />
                        <span className="font-semibold text-[#2e5d32]">
                          Circuito (Bluetooth)
                        </span>
                      </div>
                      <span className="text-gray-800 text-right break-all">
                        {resumen?.bluetooth ?? "—"}
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
