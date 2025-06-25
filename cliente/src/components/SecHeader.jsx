import { BotonAtras } from "./botones/BotonAtras";
import { datosUsuarioActual } from "../api/usuarios.api";
import { useEffect, useState } from "react";

export function SecHeader({ dir }) {
  const [usuario, setUsuario] = useState([]);

  async function cargarDatosUsuario() {
    const res = await datosUsuarioActual();
    setUsuario(res.data);
  }

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  return (
    <div className="w-full bg-amber-700">
      <BotonAtras dir={dir} /> <br />
      {usuario.Nombre}
      {usuario.ApellidoPaterno} {usuario.ApellidoMaterno}
    </div>
  );
}
