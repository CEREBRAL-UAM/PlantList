import axios from "axios";

const MonitoreoApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/monitoreo",
});

export const getDatosAmbientales = () => {
  return MonitoreoApi.get("/sensadoambiental/");
};

export const getDatosSuelo = () => {
  return MonitoreoApi.get("/sensadosuelo/");
};

export const getDatosContaminantes = () => {
  return MonitoreoApi.get("/sensadocontaminantes/");
};