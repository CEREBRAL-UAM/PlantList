import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getContaminantesDatos,
  getContaminantesFacets,
  getContaminantesRango,
} from "../../api/monitoreo.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { Link } from "react-router-dom";

/* ================= helpers comunes ================= */

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

/* ================= gráfica ================= */

const palette = {
  CO: {
    color: "rgb(177, 203, 168)",
    chip: "CO",
  },
  CO2: {
    color: "rgb(161, 197, 191)",
    chip: "CO₂",
  },
  O: {
    color: "rgb(189, 156, 137)",
    chip: "O₂",
  },
  COVs: {
    color: "rgb(107, 135, 121)",
    chip: "COVs",
  },
};

const metricKeys = Object.keys(palette);

function MultiLineChart({
  seriesMap,
  activeKeys,
  labels,
  height = 300,
  yTicks = 5,
}) {
  const padding = { top: 16, right: 16, bottom: 64, left: 56 };
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

  const xAt = (i) =>
    padding.left + (i / Math.max(1, maxLen - 1)) * w;
  const yAt = (v) =>
    padding.top + (1 - (v - min) / span) * h;

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => i);
  const yLabels = ticks.map((t) => {
    const v = min + (1 - t / yTicks) * span;
    const p = span >= 10 ? 0 : span >= 1 ? 1 : 2;
    return Number(v.toFixed(p));
  });

  const xCount = Math.min(10, maxLen || 1);
  const xIdxs = Array.from(
    { length: xCount },
    (_, i) =>
      Math.round(((i / (xCount - 1 || 1)) * (maxLen - 1)) || 0)
  );

  return (
    <div ref={wrapRef} className="w-full">
      <svg width={width} height={height}>
        {/* grid + eje Y */}
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

        {/* eje X */}
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

/* ================= componente principal ================= */

export function MonitoreoContaminantes() {
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
  const hasAccess = Boolean(isAdmin || role === "admin" || token);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [noSpaces, setNoSpaces] = useState(false);

  // Datos públicos
  const [datosPublic, setDatosPublic] = useState([]);
  const ultimoPublic = datosPublic?.[0];

  // Facets (privado)
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

  // Series + resumen (privado)
  const [series, setSeries] = useState({
    CO: [],
    CO2: [],
    O: [],
    COVs: [],
  });
  const [labels, setLabels] = useState([]);
  const [activeKeys, setActiveKeys] = useState(new Set(metricKeys));
  const [resumen, setResumen] = useState(null);

  const [rangeMode, setRangeMode] = useState(false);
  const POLL_MS = 1000;
  const HISTORY_LEN = 80;

  // Nombre de espacio (privado) usando facets
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

  useEffect(() => {
    if (hasAccess) return;
    (async () => {
      try {
        const res = await getContaminantesDatos();
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.results)
          ? res.data.results
          : [];
        setDatosPublic(raw);
      } catch {
        // silencio
      } finally {
        setLoading(false);
      }
    })();
  }, [hasAccess]);

  /* ===== Facets para usuarios con acceso ===== */
  useEffect(() => {
    if (!hasAccess) return;
    (async () => {
      try {
        const { data } = await getContaminantesFacets({});
        const esp = data?.espacios || [];
        setEspacios(esp);
        setNoSpaces(esp.length === 0);
        setCircuitos(data?.circuitos || []);
        const fechas = data?.fechas || [];
        setFechasIni(fechas);
        setFechasFin(fechas);
        setFechasIniBase(fechas);
        setFechasFinBase(fechas);
        setHorasIni([]);
        setHorasFin([]);
      } catch {
        setNoSpaces(true);
        setEspacios([]);
        setCircuitos([]);
        setFechasIni([]);
        setFechasFin([]);
        setFechasIniBase([]);
        setFechasFinBase([]);
        setHorasIni([]);
        setHorasFin([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [hasAccess]);

  /* ===== Handlers facets ===== */

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
      const { data } = await getContaminantesFacets({ id_espacios: v });
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
      const { data } = await getContaminantesFacets({ bluetooth: v });
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
      const { data } = await getContaminantesFacets({
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
      const { data } = await getContaminantesFacets({
        bluetooth: idCircuito,
        fecha: v,
      });
      let horas = data?.horas || [];
      if (fechaIni && v === fechaIni && horaIni) {
        horas = horas.filter((h) => h >= horaIni);
      }
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
        const { data } = await getContaminantesFacets({
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

  /* ===== Ready rango ===== */

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
  }, [hasAccess, idEspacio, idCircuito, fechaIni, horaIni, fechaFin, horaFin]);

  /* ===== Consultar rango ===== */

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
        { ...payloadBase, fecha_inicio: fechaIni, fecha_fin: fechaFin },
      ];

      let list = [];
      for (let i = 0; i < attempts.length; i++) {
        try {
          const { data } = await getContaminantesRango(attempts[i]);
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
        setSeries({ CO: [], CO2: [], O: [], COVs: [] });
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
        CO: rows.map((r) => Number(r?.CO)).filter(Number.isFinite),
        CO2: rows.map((r) => Number(r?.CO2)).filter(Number.isFinite),
        O: rows.map((r) => Number(r?.O)).filter(Number.isFinite),
        COVs: rows.map((r) => Number(r?.COVs)).filter(Number.isFinite),
      };
      setSeries(next);

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
      setError(e?.message || "Error al consultar el rango.");
    } finally {
      setLoading(false);
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
    setSeries({ CO: [], CO2: [], O: [], COVs: [] });
    setLabels([]);
    setResumen(null);
    setActiveKeys(new Set(metricKeys));
    setStatus("");
    setError("");
  };

  /* ===== Modo en vivo (privado) ===== */
  async function tickLive(seed = false) {
    try {
      const res = await getContaminantesDatos();
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
        ? raw.filter(
            (r) =>
              String(r.bluetooth ?? r.id_Circuito) === String(idCircuito)
          )
        : raw;

      if (!fuente.length) return;

      const last = fuente[0];
      const dLast = rowDate(last);

      setResumen({
        fecha: dLast,
        bluetooth: last.bluetooth,
        id_espacios: last.id_espacios ?? null,
      });

      if (seed) {
        const base = fuente.slice(0, HISTORY_LEN).reverse();
        setLabels(base.map((r) => rowDate(r) || new Date()));
        setSeries({
          CO: base.map((r) => Number(r?.CO)).filter(Number.isFinite),
          CO2: base.map((r) => Number(r?.CO2)).filter(Number.isFinite),
          O: base.map((r) => Number(r?.O)).filter(Number.isFinite),
          COVs: base.map((r) => Number(r?.COVs)).filter(Number.isFinite),
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
          push("CO", u?.CO);
          push("CO2", u?.CO2);
          push("O", u?.O);
          push("COVs", u?.COVs);
          return next;
        });
      }
    } catch {
    }
  }

  useEffect(() => {
    if (!hasAccess || noSpaces) return;
    if (rangeMode) return;
    tickLive(true);
    const t = setInterval(() => tickLive(false), POLL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess, rangeMode, idCircuito, noSpaces]);

  const toggleKey = (k) => {
    setActiveKeys((prev) => {
      const s = new Set(prev);
      s.has(k) ? s.delete(k) : s.add(k);
      return s;
    });
  };

  /* ================= RENDER ================= */

  return (
    <div
      className="px-6 pt-6 pb-10 min-h-screen bg-[#fbf6f2]"
      style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
    >
      <BannerUsuario />
      <h1 className="text-xl font-extrabold text-center text-[#2e5d32]">
        MONITOREO DE CONTAMINANTES
      </h1>

      {/* ========== VISTA PÚBLICA ========== */}
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
              {/* Tarjeta informativa */}
              <div className="max-w-md mx-auto mt-8 p-6 rounded-xl shadow-lg space-y-4" style={{ backgroundColor: "rgb(235, 229, 223)" }}>

                {/* Espacio */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Id.png" alt="Espacio" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>
                    Espacio:
                    </strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.nombre_espacio
                      ?? (ultimoPublic.id_espacios
                        ? `Espacio #${ultimoPublic.id_espacios}`
                        : "—")}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Date.png" alt="Fecha" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>
                      Fecha:
                    </strong>
                  </div>
                <span style={{ color: "rgb(83, 79, 79)" }}>
                  {displayDateTime(ultimoPublic.fechaSensado ?? ultimoPublic.FechaSensado)}
                </span>
              </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/images/iconos/Bluetooth.png" alt="Bluetooth" className="w-6 h-6" />
                    <strong style={{ color: "rgb(40, 39, 39)" }}>
                      Circuito (Bluetooth):
                    </strong>
                  </div>
                  <span style={{ color: "rgb(83, 79, 79)" }}>
                    {ultimoPublic.bluetooth ?? "—"}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
                <div
                  className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                  style={{ backgroundColor: "rgb(177, 203, 168)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/CO.png" alt="CO" className="w-6 h-6" />
                    CO
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.CO ?? "—"} ppm
                  </span>
                </div>

                <div
                className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                style={{ backgroundColor: "rgb(161, 197, 191)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/CO2.png" alt="CO2" className="w-6 h-6" />
                    CO₂
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.CO2 ?? "—"} ppm
                  </span>
                </div>

                <div
                className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                style={{ backgroundColor: "rgb(189, 156, 137)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/CO2.png" alt="CO2" className="w-6 h-6" />
                    O₂
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.O ?? "—"} ppm
                  </span>
                </div>

                <div
                className="flex items-center justify-between rounded-full px-6 py-4 shadow text-white"
                style={{ backgroundColor: "rgb(107, 135, 121)" }}
                >
                  <span className="flex items-center gap-3 text-xl font-semibold">
                    <img src="/images/iconos/COVs.png" alt="COVs" className="w-6 h-6" />
                    COVs
                  </span>
                  <span className="text-xl font-bold text-white">
                    {ultimoPublic.COVs ?? "—"} ppm
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========== VISTA PRIVADA (SUSCRIPTOR / ADMIN) ========== */}
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
              {/* FILTROS + BOTONES (arriba) */}
              <div className="bg-transparent">
                <div className="flex items-center gap-3 text-[#2e5d32] font-semibold mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#c8dcbc]">
                    <span className="w-3 h-3 border-t-2 border-b-2 border-[#2e5d32]" />
                  </span>
                  <span>Filtrar datos de contaminantes</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={idEspacio}
                    onChange={(e) => onEspacio(e.target.value)}
                    disabled={noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[140px]"
                  >
                    <option value="">
                      {noSpaces ? "Sin espacios" : "Espacio"}
                    </option>
                    {espacios.map((e) => (
                      <option
                        key={e.id ?? e.id_espacios}
                        value={e.id ?? e.id_espacios}
                      >
                        {e.nombre ??
                          e.nombre_espacio ??
                          `Espacio #${e.id ?? e.id_espacios}`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={idCircuito}
                    onChange={(e) => onCircuito(e.target.value)}
                    disabled={!idEspacio || noSpaces}
                    className="appearance-none px-4 py-2 rounded-lg bg-[#c8dcbc] text-[#2e5d32] font-semibold shadow-inner border border-[#a9c19e] min-w-[160px]"
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
                    <option value="">Fecha inicio</option>
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
                    <option value="">Fecha fin</option>
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

                  {/* BOTONES (azul para Consultar, gris para Limpiar) */}
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
                    {status && (
                      <p className="text-amber-700">{status}</p>
                    )}
                    {error && (
                      <p className="text-red-700">Error: {error}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Chips de variables */}
              <div className="flex flex-wrap gap-3 mt-2">
                {metricKeys.map((k) => {
                  const active = activeKeys.has(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleKey(k)}
                      className={`px-4 py-2 rounded-full font-semibold shadow-sm border text-sm ${
                        active ? "text-white" : "bg-[#d4d4d4] text-[#374151]"
                      }`}
                      style={{
                        backgroundColor: active ? palette[k].color : undefined,
                        borderColor: active ? palette[k].color : "#D1D5DB",
                      }}
                    >
                      {palette[k].chip}
                    </button>
                  );
                })}
              </div>

              {/* Gráfica + tarjeta */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_320px] gap-6 items-start">
                {/* Gráfica */}
                <div className="min-w-0">
                  {loading ? (
                    <p className="text-gray-700">Cargando…</p>
                  ) : (
                    <MultiLineChart
                      seriesMap={series}
                      activeKeys={activeKeys}
                      labels={labels}
                      height={300}
                    />
                  )}
                  <div className="mt-2 text-xs text-gray-600">
                    {rangeMode
                      ? "Mostrando datos por rango."
                      : "Modo en vivo (últimos datos)."}
                  </div>
                </div>

                {/* Tarjeta de datos */}
                <aside className="bg-[#f4efe9] border border-[#e3dbd3] rounded-xl shadow p-5">
                  <div className="space-y-3 text-sm">
                    {/* Espacio */}
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-3 items-center">
                        <img src="/images/iconos/Id.png" alt="Espacio" className="w-6 h-6" />
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
                        <img src="/images/iconos/Bluetooth.png" alt="Bluetooth" className="w-6 h-6" />
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
