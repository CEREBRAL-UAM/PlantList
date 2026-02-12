import { useNavigate } from "react-router";

export function BotonEditar({ dir }) {
  const navigate = useNavigate();

  return (
    <div className="pt-3">
      <button
        onClick={() => navigate(dir)}
        className=" 
      bg-pl_green_c text-white 
      rounded-full shadow-lg 
      opacity-30
      hover:opacity-100
      dark:text-pl_white_a
      dark:opacity-100
      dark:hover:brightness-125
      w-8 h-8 flex justify-center items-center"
        aria-label="Eliminar espacio"
      >
        <img
          src="/images/iconos/icono_lapiz.png"
          alt="edit"
          className="w-5 h-5 opacity-100"
        />
      </button>
    </div>
  );
}
