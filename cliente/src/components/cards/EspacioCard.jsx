import { useNavigate } from "react-router-dom";
import { BotonEliminarEspacio } from "../botones/BotonEliminarEspacio";
import { BotonEditar } from "../botones/BotonEditar";

export function EspacioCard({ espacio, onDelete }) {
  const navigate = useNavigate();

  const imagenUrl = espacio.foto
    ? `${espacio.foto}`
    : "http://localhost:8000/media/espacios/default.jpg";

  return (
    <div className="text-center">
      <div
        onClick={() => {
          navigate(`/biolink_ipc/verEspacio/${espacio.id_espacios}`);
        }}
        className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg group"
      >
        <img
          src={imagenUrl}
          alt="No imagen disponible"
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-105"
        />

        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent z-10 rounded-2xl"></div>

        <h2 className="absolute bottom-3 left-4 text-white text-base sm:text-lg md:text-xl font-nunito z-20">
          {espacio.nombre_espacio}
        </h2>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        <BotonEliminarEspacio
          id_espacios={espacio.id_espacios}
          key={espacio.id_espacios}
          onDelete={onDelete}
        />
        <BotonEditar dir="pendiente" />
      </div>
    </div>
  );
}
