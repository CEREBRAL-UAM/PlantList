import { BotonAtras } from "../botones/BotonAtras";
import { Link } from "react-router";

export function BannerUsuario({ dir }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const fotoPerfil = localStorage.getItem("foto");

  const imagenUrl =
    fotoPerfil && fotoPerfil !== "null"
      ? `${API_URL}${fotoPerfil}`
      : `${API_URL}/media/fotos_perfil_usuarios/default.jpg`;

  return (
    <div className="w-1/2">
      <BotonAtras dir={dir} /> <br />
      <div className="flex items-center gap-3 pl-8">
        <img
          src={imagenUrl}
          alt="Imagen no disponible"
          className="rounded-full w-9 h-9"
        />
        <Link to="/biolink_ipc/perfil">
          <h2 className="dark:text-pl_white_a font-baloo">
            {localStorage.getItem("nombre")} {localStorage.getItem("apellidoP")}
          </h2>
        </Link>
      </div>
    </div>
  );
}
