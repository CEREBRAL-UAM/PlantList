import axios from "axios";

const EspacioApi = axios.create({
  baseURL: "http://localhost:8000/plantas/apiv1/espacios/",
});

export const getEspacios = () => {
  return EspacioApi.get("/");
};

export const crearEspacio = (espacio) => {
  return EspacioApi.post("/", espacio, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getEspacio = (id) => {
  return EspacioApi.get(`/${id}`);
};

export const eliminarEspacio = (id) => {
  return EspacioApi.delete(`/${id}`);
};
