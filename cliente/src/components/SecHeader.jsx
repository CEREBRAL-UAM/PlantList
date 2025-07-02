import { BotonAtras } from "./botones/BotonAtras";
import { datosUsuarioActual } from "../api/usuarios.api";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function SecHeader({ dir }) {
  const [usuario, setUsuario] = useState([]);

  async function cargarDatosUsuario() {
    const res = await datosUsuarioActual();
    setUsuario(res.data);
  }

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const imagenUrl = usuario.foto
    ? `${usuario.foto}`
    : "http://localhost:8000/media/fotos_perfil_usuarios/default.jpg";

  return (
    <div className="w-1/2">
      <BotonAtras dir={dir} /> <br />
      <div className="flex items-center gap-3 pl-8">
        <img
          src={imagenUrl}
          alt="Imagen ni disponible"
          className="rounded-full w-9 h-9"
        />
        <Link to="/biolink_ipc/perfil">
          <h2 className="dark:text-pl_white_a font-baloo">
            {usuario.Nombre} {usuario.ApellidoPaterno}
          </h2>
        </Link>
      </div>
    </div>
  );
}
