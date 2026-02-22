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

export const searchGestionExperimentos = ({
  espacio_id,
  tipo_id,
  fecha,
} = {}) => {
  const params = new URLSearchParams();

  if (espacio_id) params.append("espacio_id", espacio_id);
  if (tipo_id) params.append("tipo_id", tipo_id);
  if (fecha) params.append("fecha", fecha);

  return ExperimentosApi.get(`/apiv1/gestion/?${params.toString()}`);
};

export const deleteExperimento = (id) => {
  return ExperimentosApi.delete(`/experimento/${id}/`);
};

export const getCircuitosPorEspacio = (espacioId) => {
  const params = new URLSearchParams();
  if (espacioId) params.append("espacioId", espacioId);
  return ExperimentosApi.get(`/apiv1/circuitos_por_espacio/?${params.toString()}`);
};

export const createVideo = (formData) => {
  return ExperimentosApi.post("/video/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createExperimento = (data) => {
  return ExperimentosApi.post("/experimento/", data);
};
