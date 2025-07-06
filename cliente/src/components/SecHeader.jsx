import { BotonAtras } from "./botones/BotonAtras";
import { Link } from "react-router";

export function SecHeader({ dir }) {
  const fotoPerfil = localStorage.getItem("foto");

  const imagenUrl =
    fotoPerfil && fotoPerfil !== "null"
      ? `http://localhost:8000${fotoPerfil}`
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
            {localStorage.getItem("nombre")} {localStorage.getItem("apellidoP")}
          </h2>
        </Link>
      </div>
    </div>
  );
}
