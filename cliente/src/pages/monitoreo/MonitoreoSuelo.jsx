import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getDatosSuelo,
  getSueloFacets,
  getSueloRango,
} from "../../api/monitoreo.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { Link } from "react-router-dom";

/* ================= helpers de acceso y datos ================= */
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
  const keys = ["authToken", "token", "Token", "Authorization", "TokenUsuario", "userToken", "tokenUser", "acessToken"];
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
  const iso = `${dateStr}T${String(hh).padStart(2, "0")}:${String(mm).padStart(
    2,
    "0"
  )}:00`;
  const dt = new Date(iso);
  return isNaN(dt) ? null : dt;
}

const SERVER_TIMEZONE = "America/Mexico_City";

function formatInTimeZone(date, tz) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

function buildRangeStrings(fechaIni, horaIni, fechaFin, horaFin) {
  const localStart = `${fechaIni}T${horaIni}:00`;
  const localEnd = `${fechaFin}T${horaFin}:00`;
  return {
    start_send: formatInTimeZone(new Date(localStart), SERVER_TIMEZONE),
    end_send: formatInTimeZone(new Date(localEnd), SERVER_TIMEZONE),
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
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

/* ================= helpers display ================= */
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

/* ================= gráfica principal ================= */
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
  Voltaje: {
    color: "rgb(230, 165, 140)",
    chip: "Voltaje",
  },
  Amperaje: {
    color: "rgb(177, 203, 168)",
    chip: "Amperaje",
  },
  PhSuelo: {
    color: "rgb(189, 156, 137)",
    chip: "pH",
  },
  HumedadSuelo: {
    color: "rgb(220, 175, 185)",
    chip: "Humedad",
  },
};


const metricKeys = Object.keys(palette);

function MultiLineChart({
  seriesMap,
  activeKeys,
  labels,
  height = 360,
  yTicks = 5,
}) {
  const padding = { top: 16, right: 16, bottom: 64, left: 56 };
  const [wrapRef, width] = useContainerWidth();
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const allValues = [];
  activeKeys.forEach((k) =>
    (seriesMap[k] || []).forEach((v) =>
      Number.isFinite(v) ? allValues.push(v) : null
    )
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
    (_, i) =>
      Math.round(((i / (xCount - 1 || 1)) * (maxLen - 1)) || 0)
  );

  return (
    <div ref={wrapRef} className="w-full">
      <svg width={width} height={height}>
        {ticks.map((t, i) => {
          const y = padding.top + (t / yTicks) * h;
          return (
            <g key={`gy-${i}`}>
              <line
                x1={padding.left}
                x2={padding.left + w}
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

        <line
          x1={padding.left}
          x2={padding.left + w}
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
              <line
                x1={x}
                x2={x}
                y1={y}
                y2={y + 4}
                stroke="#9CA3AF"
              />
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

/* ================= componente principal ================= */
export function MonitoreoSuelo() {
  const user = getUserFromStorage();
  const role = (
    user?.Rol ||
    user?.rol ||
    user?.role ||
    ""
  )
    .toString()
    .toLowerCase();

  const isAdmin =
    parseBoolMaybe(user?.isAdmin) ||
    parseBoolMaybe(user?.esAdmin) ||
    parseBoolMaybe(user?.is_admin);

  const token = getTokenFromStorage();
  const hasAccess = Boolean(token);

  const [loading, setLoading] = useState(true);
  const [noSpaces, setNoSpaces] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [datosPublic, setDatosPublic] = useState([]);
  const ultimoPublic = datosPublic?.[0] ?? null;

  useEffect(() => {
  if (hasAccess) return;

  let alive = true;

  (async () => {
    try {
      const res = await getDatosSuelo();

      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];

      if (!alive) return;

      setDatosPublic(raw);
    } catch (e) {
      console.error("Error cargando suelo público", e);
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [hasAccess]);

/* ===== Facets para vista privada ===== */
  useEffect(() => {
    if (!token) return;

    let alive = true;

    (async () => {
      try {
        const { data } = await getSueloFacets({});
        if (!alive) return;

        const esp = data?.espacios || [];
        setEspacios(esp);
        setNoSpaces(esp.length === 0);
      } catch {
        if (!alive) return;
        setEspacios([]);
        setNoSpaces(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  /* ===== Estados de filtros ===== */
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

  /* ===== Series para gráfica ===== */
  const [series, setSeries] = useState({
    Voltaje: [],
    Amperaje: [],
    PhSuelo: [],
    HumedadSuelo: [],
  });
  const [labels, setLabels] = useState([]);
  const [activeKeys, setActiveKeys] = useState(new Set(metricKeys));
  const [resumen, setResumen] = useState(null);

  const [rangeMode, setRangeMode] = useState(false);
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

  /* ======================= HANDLERS DE FILTRO ======================= */

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
      const { data } = await getSueloFacets({ id_espacios: v });
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
    setFechasIni([]);
    setFechasFin([]);
    setFechasIniBase([]);
    setFechasFinBase([]);

    try {
      const { data } = await getSueloFacets({ bluetooth: v });

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
      const { data } = await getSueloFacets({
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
      const { data } = await getSueloFacets({
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

  /* Actualiza horas fin si cambia horaIni */
  useEffect(() => {
    if (!hasAccess) return;
    if (!idCircuito || !fechaIni || !fechaFin) return;
    if (fechaIni !== fechaFin) return;

    (async () => {
      try {
        const { data } = await getSueloFacets({
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

  /* ===== READY PARA CONSULTAR RANGO ===== */
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

    return Boolean(dIni && dFin && dFin.getTime() >= dIni.getTime());
  }, [
    hasAccess,
    idEspacio,
    idCircuito,
    fechaIni,
    horaIni,
    fechaFin,
    horaFin,
  ]);
  /* ================= CONSULTA POR RANGO ================= */
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
        id_espacios: coerceNum(idEspacio) ?? idEspacio,
        bluetooth: idCircuito,
      };

      const attempts = [
        {
          ...payloadBase,
          start: start_send,
          end: end_send,
        },
        {
          ...payloadBase,
          fecha_inicio: fechaIni,
          fecha_fin: fechaFin,
        },
      ];

      let list = [];

      for (let i = 0; i < attempts.length; i++) {
        try {
          const { data } = await getSueloRango(attempts[i]);
          const raw = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : [];

          if (raw.length) {
            list = raw;
            break;
          }
        } catch {}
      }

      if (!list.length) {
        setStatus("Sin datos para el rango seleccionado.");
        setSeries({
          Voltaje: [],
          Amperaje: [],
          PhSuelo: [],
          HumedadSuelo: [],
        });
        setLabels([]);
        setResumen(null);
        return;
      }

      const rows = list
        .map((r) => ({ r, d: rowDate(r) }))
        .filter((x) => x.d)
        .sort((a, b) => a.d - b.d)
        .map(({ r, d }) => ({ ...r, __d: d }));

      setLabels(rows.map((r) => r.__d));

      const next = {
        Voltaje: rows.map((r) => Number(r?.Voltaje)).filter(Number.isFinite),
        Amperaje: rows.map((r) => Number(r?.Amperaje)).filter(Number.isFinite),
        PhSuelo: rows.map((r) => Number(r?.PhSuelo)).filter(Number.isFinite),
        HumedadSuelo: rows.map((r) =>
          Number(r?.HumedadSuelo)
        ).filter(Number.isFinite),
      };

      setSeries(next);

      const last = rows[rows.length - 1];

      setResumen(
        last
          ? {
              fecha: last.__d,
              bluetooth: last.bluetooth,
              descripcion: last.descripcion_suelo,
              nombreSuelo: last.nombre_suelo,
              idPlanta: last.id_PlantaIndividuo,
              id_espacios: last.id_espacios ?? null,
            }
          : null
      );

      setStatus("");
    } catch (e) {
      setError(e?.message || "Error al consultar el rango.");
    } finally {
      setLoading(false);
    }
  };

  /* =============== LIMPIAR FILTROS =============== */
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
      Voltaje: [],
      Amperaje: [],
      PhSuelo: [],
      HumedadSuelo: [],
    });
    setLabels([]);
    setResumen(null);
    setActiveKeys(new Set(metricKeys));
    setStatus("");
    setError("");
  };

  /* =================== MODO EN VIVO =================== */
  async function tickLive(seed = false) {
    try {
      const res = await getDatosSuelo();
      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];

      raw.sort(
        (a, b) =>
          new Date(b.fechaSensado ?? b.FechaSensado ?? b.fecha) -
          new Date(a.fechaSensado ?? a.FechaSensado ?? a.fecha)
      );

      const fuente = idCircuito
        ? raw.filter((r) => String(r.bluetooth) === String(idCircuito))
        : raw;

      if (!fuente.length) return;

      const last = fuente[0];
      const dLast = rowDate(last);

      setResumen({
        fecha: dLast,
        bluetooth: last.bluetooth,
        descripcion: last.descripcion_suelo,
        nombreSuelo: last.nombre_suelo,
        idPlanta: last.id_PlantaIndividuo,
        id_espacios: last.id_espacios ?? null,
      });

      if (seed) {
        const base = fuente.slice(0, HISTORY_LEN).reverse();

        setLabels(base.map((r) => rowDate(r) || new Date()));

        setSeries({
          Voltaje: base
            .map((r) => Number(r?.Voltaje))
            .filter(Number.isFinite),
          Amperaje: base
            .map((r) => Number(r?.Amperaje))
            .filter(Number.isFinite),
          PhSuelo: base
            .map((r) => Number(r?.PhSuelo))
            .filter(Number.isFinite),
          HumedadSuelo: base
            .map((r) => Number(r?.HumedadSuelo))
            .filter(Number.isFinite),
        });
      } else {
        const u = fuente[0];
        const d = rowDate(u) || new Date();

        setLabels((prev) => {
          const n = [...prev, d];
          if (n.length > HISTORY_LEN) n.shift();
          return n;
        });

        setSeries((prev) => {
          const next = { ...prev };

          const push = (k, v) => {
            const arr = [...(next[k] || [])];
            const num = Number(v);
            arr.push(Number.isFinite(num) ? num : arr[arr.length - 1] ?? 0);
            if (arr.length > HISTORY_LEN) arr.shift();
            next[k] = arr;
          };

          push("Voltaje", u?.Voltaje);
          push("Amperaje", u?.Amperaje);
          push("PhSuelo", u?.PhSuelo);
          push("HumedadSuelo", u?.HumedadSuelo);

          return next;
        });
      }
    } catch {
      // silencio
    }
  }

  /* Intervalo en vivo */
  useEffect(() => {
    if (!hasAccess || noSpaces) return;
    if (rangeMode) return;

    tickLive(true);

    const t = setInterval(() => tickLive(false), POLL_MS);
    return () => clearInterval(t);

  }, [hasAccess, rangeMode, idCircuito, noSpaces]);

  /* =================== ACTIVAR/DESACTIVAR SERIES =================== */
  const toggleKey = (k) => {
    setActiveKeys((prev) => {
      const s = new Set(prev);
      s.has(k) ? s.delete(k) : s.add(k);
      return s;
    });
  };

  /* ========================= INICIO DEL RENDER ========================= */
  return (
    <div
      className="px-6 pt-6 pb-10 min-h-screen bg-[#fbf6f2]"
      style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
    >
      <BannerUsuario />

      <h1 className="text-xl font-extrabold text-center text-[#2e5d32]">
        MONITOREO DE SUELO
      </h1>

      {/* ======================= VISTA PÚBLICA ======================= */}
      {!hasAccess && (
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-600 text-xl mt-8">
              Cargando datos...
            </p>
          ) : !ultimoPublic ? (
            <p className="text-center text-gray-600 text-xl mt-8">
              No hay datos disponibles.
            </p>
          ) : (
            <>
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
                  {displayDateTime(
                      ultimoPublic.fechaSensado ?? ultimoPublic.FechaSensado
                  )}
                </span>
              </div>

                {/* Circuito */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Bluetooth.png" alt="Bluetooth" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Circuito:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.bluetooth ?? "—"}
                  </span>
                </div>
                
                {/* Planta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Plant.png" alt="Plant" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>ID Planta Individuo:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.id_PlantaIndividuo ?? "No asignado"}
                  </span>
                </div>

                {/* Suelo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Floor.png" alt="Floor" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Suelo:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.nombre_suelo ?? "Desconocido"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Description.png" alt="Description" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>Descripcion:</strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.descripcion_suelo ?? "Sin descripción"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
                {/* Voltaje */}
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

                {/* Amperaje */}
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

                {/* pH */}
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(189, 156, 137)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/pH.png" alt="pH" className="w-6 h-6" />
                    pH
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.PhSuelo ?? "—"}
                  </span>
                </div>

                {/* Humedad */}
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(220, 175, 185)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/Humedad.png" alt="Humedad" className="w-6 h-6" />
                    Humedad
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
      {/* ======================= VISTA PRIVADA ======================= */}
      {hasAccess && (
        <>
          
          {/* Si no hay espacios asignados */}
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
              
              {/* ================= FILTROS ================= */}
              <div className="bg-transparent">
                <div className="flex items-center gap-3 text-[#2e5d32] font-semibold mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#c8dcbc]">
                    <span className="w-3 h-3 border-t-2 border-b-2 border-[#2e5d32]" />
                  </span>
                  <span>Filtrar datos de suelo</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                  {/* ESPACIO */}
                  <select
                    value={idEspacio}
                    onChange={(e) => onEspacio(e.target.value)}
                    disabled={noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold border border-[#a9c19e] min-w-[140px]"
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

                  {/* CIRCUITO */}
                  <select
                    value={idCircuito}
                    onChange={(e) => onCircuito(e.target.value)}
                    disabled={!idEspacio || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Circuito (Bluetooth)</option>
                    {circuitos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* FECHA INI */}
                  <select
                    value={fechaIni}
                    onChange={(e) => onFechaIni(e.target.value)}
                    disabled={!idCircuito || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Fecha inicio</option>
                    {fechasIni.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  {/* FECHA FIN */}
                  <select
                    value={fechaFin}
                    onChange={(e) => onFechaFin(e.target.value)}
                    disabled={!fechaIni || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">Fecha fin</option>
                    {fechasFin.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  {/* HORA INI */}
                  <select
                    value={horaIni}
                    onChange={(e) => setHoraIni(e.target.value)}
                    disabled={!fechaIni || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] border border-[#cfe0c6] min-w-[140px]"
                  >
                    <option value="">Hora inicio</option>
                    {horasIni.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>

                  {/* HORA FIN */}
                  <select
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    disabled={!fechaFin || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] border border-[#cfe0c6] min-w-[140px]"
                  >
                    <option value="">Hora fin</option>
                    {horasFin.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>

                  {/* BOTONES */}
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={consultar}
                      disabled={!ready || noSpaces}
                      className={`px-4 py-2 rounded-full text-white shadow ${
                        !ready || noSpaces
                          ? "bg-[#78b486] cursor-not-allowed"
                          : "bg-[#3b7f4a] hover:bg-[#316b3f]"
                      }`}
                    >
                      Consultar
                    </button>

                    <button
                      type="button"
                      onClick={limpiar}
                      disabled={noSpaces}
                      className="px-4 py-2 rounded-full bg-[#e8eae6] text-[#2e5d32] border border-[#cbd5c1] hover:bg-[#dde3d8]"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {(status || error) && (
                  <div className="text-xs mt-2">
                    {status && <p className="text-amber-700">{status}</p>}
                    {error && <p className="text-red-700">Error: {error}</p>}
                  </div>
                )}
              </div>
              
              {/* Contenedor de Chips */}
              <div className="flex flex-wrap gap-3 mt-4">
                {metricKeys
                .filter((k) => ["PhSuelo", "HumedadSuelo"].includes(k))
                .map((k) => {
                  const active = activeKeys.has(k);
                  const iconoNombre = k === "PhSuelo" ? "pH" : "Humedad";
                
              return (
              <button key={k} type="button" onClick={() => toggleKey(k)}
              className={`flex items-center gap-3 rounded-full px-4 py-2 shadow-md transition-all border-2 ${
                active ? "scale-100 opacity-100" : "scale-95 opacity-50 grayscale bg-[#f3f4f6] border-[#d1d5db]"
              }`}
              style={{
                backgroundColor: active ? palette[k].color : undefined,
                borderColor: active ? "rgba(255,255,255,0.4)" : "transparent",
              }}
              >
                <img 
                src={`/images/iconos/${iconoNombre}.png`} 
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

              {/* ================= GRÁFICA + BOTONES + TARJETA ================= */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_120px_340px] gap-6 items-start">

                {/* GRÁFICA */}
                <div className="min-w-0">
                  {loading ? (
                    <p className="text-gray-700">Cargando…</p>
                  ) : (
                    <MultiLineChart
                      seriesMap={series}
                      activeKeys={activeKeys}
                      labels={labels}
                    />
                  )}
                  <div className="mt-2 text-xs text-gray-600">
                    {rangeMode
                      ? "Mostrando datos por rango."
                      : "Modo en vivo (últimos datos)."}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
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

                {/* ================= TARJETA LATERAL ================= */}
                <aside className="bg-[#f4efe9] border border-[#e3dbd3] rounded-xl shadow p-5">
                  <div className="space-y-3 text-sm">

                    {/* ESPACIO */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Id.png" alt="Espacio" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Espacio</span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumenEspacioNombre}
                      </span>
                    </div>

                    {/* Fecha */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Date.png" alt="Fecha" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Fecha</span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumen ? displayDateTime(resumen.fecha) : "—"}
                      </span>
                    </div>

                    {/* Circuito */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Bluetooth.png" alt="Bluetooth" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Circuito</span>
                      </div>
                      <span className="text-gray-800 text-right break-all">
                        {resumen?.bluetooth ?? "—"}
                      </span>
                    </div>

                    {/* Suelo */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Floor.png" alt="Floor" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Suelo</span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumen?.nombreSuelo ?? "—"}
                      </span>
                    </div>

                    {/* Planta */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Plant.png" alt="Plant" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Planta</span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumen?.idPlanta ?? "—"}
                      </span>
                    </div>

                    {/* Descripción */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Description.png" alt="Descripcion" className="w-6 h-6" />
                        <span className="font-semibold text-[#2e5d32]">Descripción</span>
                      </div>
                      <span className="text-gray-800 text-right">
                        {resumen?.descripcion ?? "—"}
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
