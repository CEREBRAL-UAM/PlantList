import { Minus } from "lucide-react";
import { useNavigate } from "react-router";

export function BotonEditar({ dir }) {
  const navigate = useNavigate();

  return (
    <div className="pt-4">
      <button
        onClick={() => navigate(dir)}
        className=" 
      bg-pl_green_c text-white 
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
