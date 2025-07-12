import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BotonAtras({ dir }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(dir || -1);
        /* Si no se recibe la direccion
        se redireccion a la anterior pagina 
        visitada en el navegador */
      }}
    >
      <ArrowLeft
        className="
        w-10 h-10 
        cursor-pointer
        pl-3
        dark:text-pl_white_a"
      />
    </button>
  );
}
