import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

export function BotonAgregar({ dir }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(dir)}
      className="
      fixed bottom-6 right-6 bg-pl_green_a text-white 
      rounded-full p-5 shadow-lg hover:bg-pl_green_e 
      dark:text-pl_green_b z-30"
      aria-label="Agregar planta"
    >
      <Plus className="w-7 h-7" />
    </button>
  );
}
