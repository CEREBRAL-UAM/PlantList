import axios from "axios";

const EspecieApi = axios.create({
  baseURL: "http://localhost:8000/plantas/apiv1/especies/",
});

export const getEspecies = () => {
  return EspecieApi.get("/");
};

export const crearEspecie = (especie) => {
  return EspecieApi.post("/", especie, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
