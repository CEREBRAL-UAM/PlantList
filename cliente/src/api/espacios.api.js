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

export const crearEspacioUsuario = (espacio) => {
  const token = localStorage.getItem("token");
  return EspacioApi.post("/crear_espacio/", espacio, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEspaciosUsuario = () => {
  const token = localStorage.getItem("token");
  return EspacioApi.get("/mis_espacios/", {
    headers: { Authorization: `Token ${token}` },
  });
};

export const getEspacio = (id) => {
  return EspacioApi.get(`/${id}`);
};

export const eliminarEspacio = (id) => {
  return EspacioApi.delete(`/${id}`);
};
