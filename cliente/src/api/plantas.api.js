import axios from "axios";

const plantaApi = axios.create({
  baseURL: "http://localhost:8000/plantas/apiv1/plantas/",
});

// Nueva instancia para alcanzar la tabla intermedia PlantasEspacios
const apiBase = axios.create({
  baseURL: "http://localhost:8000/plantas/apiv1/",
});

export const getPlantas = () => {
  return plantaApi.get("/");
};

export const crearPlanta = (planta) => {
  return plantaApi.post("/", planta, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// FUNCIÓN CLAVE: Crea la relación en la tabla intermedia
export const asignarPlantaAEspacio = (datosRelacion) => {
  return apiBase.post("plantas_espacios/", datosRelacion);
};

export const getPlanta = (id) => {
  return plantaApi.get(`/${id}`);
};

export const eliminarPlanta = (id) => {
  return plantaApi.delete(`/${id}`);
};

<<<<<<< HEAD
export const getPlantasPorEspacio = (id_espacios) => {
  // USAMOS apiBase para que use el puerto 8000
  // Y quitamos el "/" inicial para que se pegue correctamente a la baseURL
  return apiBase.get(`plantas/?id_espacios=${id_espacios}`);
};

export const getPartePlanta = () => {
  // USAMOS apiBase aquí también
  return apiBase.get("parte_planta/");
};
=======
export const getPlantasPorEspacio = (id_espacios) =>
  axios.get(`/plantas/apiv1/plantas/?id_espacios=${id_espacios}`);

export const getPartePlanta = () => axios.get("http://localhost:8000/plantas/apiv1/parte_planta/");
>>>>>>> master
