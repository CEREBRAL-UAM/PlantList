import { Link } from "react-router";
import { BotonAtras } from "../botones/BotonAtras";

export function BannerUsuario({ dir }) {
  // Cambiamos API_URL por la dirección raíz del servidor
  const BASE_URL = "http://localhost:8000"; 

  const fotoPerfil = localStorage.getItem("foto");

  // Construimos la URL usando BASE_URL para que la ruta sea /media/...
  const imagenUrl =
    fotoPerfil && fotoPerfil !== "null"
      ? `${BASE_URL}${fotoPerfil}`
      : `${BASE_URL}/media/fotos_perfil_usuarios/default.jpg`;

  return (
    <div className="w-1/2">
      <BotonAtras dir={dir} /> <br />
      <div className="flex items-center gap-3 pl-8">
        <img
          src={imagenUrl}
          alt="Imagen no disponible"
          className="rounded-full w-9 h-9 object-cover" // Añadí object-cover para que no se deforme
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