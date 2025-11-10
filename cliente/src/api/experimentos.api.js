import axios from "axios";

const ExperimentosApi = axios.create({
    baseURL: "http://localhost:8000/api/experimentos",
});

ExperimentosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export const getTipoEstimulacion = () => {
    return ExperimentosApi.get("/tipoestimulacion/")
};

export const getMaterial = () => {
    return ExperimentosApi.get("/material/")
};

export const getElectrodos = () => {
    return ExperimentosApi.get("/electrodos/")
};

export const getUbicaciones = () => {
    return ExperimentosApi.get("/ubicaciones/")
}

export const getSuelo = () => {
    return ExperimentosApi.get("/suelo/")
};

export const getEtapaDesarrollo = () => {
    return ExperimentosApi.get("/etapadesarrollo/")
};

export const getOrigenCrianza = () => {
    return ExperimentosApi.get("/origencrianza/")
};

export const getPlagas = () => {
    return ExperimentosApi.get("/plagas/")
};

export const getPlantaIndividuo = () => {
    return ExperimentosApi.get("/plantaindividuo/")
};

export const searchGestionExperimentos = ({ q, limit, offset } = {}) => {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);
  const qs = params.toString();
  return ExperimentosApi.get(`/apiv1/gestion/${qs ? `?${qs}` : ""}`);
};

export const deleteExperimento = (id) => {
  return ExperimentosApi.delete(`/experimento/${id}/`);
};

export const getCircuitosPorEspacio = (espacioId) => {
  const params = new URLSearchParams();
  if (espacioId) params.append("espacioId", espacioId);
  return ExperimentosApi.get(`/apiv1/circuitos_por_espacio/?${params.toString()}`);
};
