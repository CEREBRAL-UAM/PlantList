import { Minus } from "lucide-react";
import { eliminarEspacio } from "../api/espacios.api";

export function BotonEliminarEspacio({ id_espacios, onDelete }) {
  return (
    <div className="pt-4">
      <button
        onClick={async () => {
          const acepted = window.confirm("Borrar espacio ??");

          if (acepted) {
            await eliminarEspacio(id_espacios);
            onDelete();
          }
        }}
        className="
      bg-pl_red_a text-white 
      rounded-full shadow-lg 
      opacity-30
      hover:opacity-100
      dark:text-pl_white_a
      dark:opacity-100
      dark:hover:brightness-125"
        aria-label="Eliminar espacio"
      >
        <Minus className="w-7 h-7" />
      </button>
    </div>
  );
}
