// src/api/monitoreo.api.js
import axios from "axios";

const MonitoreoApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/monitoreo",
  withCredentials: false,
  timeout: 15000,
});

// ================= TOKEN =================

function getTokenFromStorage() {
  const keys = ["authToken", "token", "Token", "Authorization", "TokenUsuario"];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v.replace(/^Token\s+/i, "").trim();
  }
  return null;
}

MonitoreoApi.interceptors.request.use((config) => {
  const tok = getTokenFromStorage();
  if (tok) {
    config.headers.Authorization = `Token ${tok}`;
  } else {
    delete config.headers.Authorization;
  }
  config.withCredentials = false; // sin cookies
  return config;
});

// =======================================================
// ===================== PÚBLICOS ========================
// =======================================================

// El backend decide si eres público o autenticado según Authorization
export const getDatosAmbientales = () =>
  MonitoreoApi.get("/ambiental/");

export const getDatosSuelo = () =>
  MonitoreoApi.get("/suelo/");

export const getDatosContaminantes = (params = {}) =>
  MonitoreoApi.get("/sensadocontaminantes/", { params });

// =======================================================
// ==================== AMBIENTAL =========================
// =======================================================

export const getEspacios = () =>
  MonitoreoApi.get("/sensadoambiental/espacios/");

export const getCircuitos = () =>
  MonitoreoApi.get("/sensadoambiental/circuitos/");

export const getHistoricosFacets = (params = {}) =>
  MonitoreoApi.get("/historicos/facets/", { params });

export const getAmbientalRango = (params = {}) =>
  MonitoreoApi.get("/sensadoambiental/rango/", { params });

// =======================================================
// ================== CONTAMINANTES ======================
// =======================================================

// Lista / histórico
export const getContaminantesDatos = (params = {}) =>
  MonitoreoApi.get("/sensadocontaminantes/", { params });

// Facets (APIView independiente)
export const getContaminantesFacets = (params = {}) =>
  MonitoreoApi.get("/contaminantes/facets/", { params });

// Rango
export const getContaminantesRango = (params = {}) =>
  MonitoreoApi.get("/sensadocontaminantes/rango/", { params });

// =======================================================
// ======================= SUELO ==========================
// =======================================================

export const getSueloFacets = (params = {}) =>
  MonitoreoApi.get("/suelo/facets/", { params });

export const getSueloRango = (params = {}) =>
  MonitoreoApi.get("/sensadosuelo/rango/", { params });

// =======================================================
// =================== ERRORES ============================
// =======================================================

export function unwrapApiError(err) {
  if (err?.response?.data) return err.response.data;
  if (err?.message) return err.message;
  return "Error de red/desconocido";
}
