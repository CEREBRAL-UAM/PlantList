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
