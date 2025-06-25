import axios from "axios";

const UsuarioApi = axios.create({
  baseURL: "http://localhost:8000/usuarios/apiv1/",
});

export const registrarUsuario = (nuevoUsuario) => {
  return UsuarioApi.post("/registro/", nuevoUsuario);
};

export const loginUsuario = (datos) => {
  return UsuarioApi.post("/login/", datos);
};

export const logoutUsuario = () => {
  const token = localStorage.getItem("token");
  return UsuarioApi.post("/logout/", {
    headers: { Authorization: `Token ${token}` },
  });
};

export const datosUsuarioActual = () => {
  const token = localStorage.getItem("token");
  return UsuarioApi.get("/actual/", {
    headers: { Authorization: `Token ${token}` },
  });
};
