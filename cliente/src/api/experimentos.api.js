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
    return ExperimentosApi.get("/origencrianza")
};

export const getPlagas = () => {
    return ExperimentosApi.get("/plagas/")
};

export const getPlantaIndividuo = () => {
    return ExperimentosApi.get("/plantaindividuo/")
};
