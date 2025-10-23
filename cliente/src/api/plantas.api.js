import axios from "axios";

const plantaApi = axios.create({
  baseURL: "http://localhost:8000/plantas/apiv1/plantas/",
});

export const getPlantas = () => {
  return plantaApi.get("/");
};

export const crearPlanta = (planta) => {
  return plantaApi.post("/", planta, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getPlanta = (id) => {
  return plantaApi.get(`/${id}`);
};

export const eliminarPlanta = (id) => {
  return plantaApi.delete(`/${id}`);
};

export const getPlantasPorEspacio = (id_espacios) =>
  axios.get(`/plantas/apiv1/plantas/?id_espacios=${id_espacios}`);

// export const getPartePlanta = () => {
//   return plantaApi.get("../parte_planta/");
// };

// export const getPartePlanta = async () =>
//    axios.get("/partesPlanta/");

export const getPartePlanta = () => axios.get("http://localhost:8000/plantas/apiv1/parte_planta/");

