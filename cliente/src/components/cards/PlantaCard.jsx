import { useNavigate } from "react-router-dom";

export function PlantaCard({ planta }) {
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8000";

  // URL base para que el navegador sepa ir al puerto 8000
  const imagenUrl = planta.foto
    ? `${BASE_URL}${planta.foto}`
    : `${BASE_URL}/media/plantas/default.jpg`;

  return (
    <div
      onClick={() => {
        navigate(`/biolink_ipc/plantas/${planta.id_planta}`);
      }}
      className="
      relative cursor-pointer 
      overflow-hidden rounded-2xl 
      shadow-lg group"
      style={{
        borderTopLeftRadius: "60px",
        borderTopRightRadius: "60px",
      }}
    >
      <img
        src={imagenUrl}
        alt="No imagen disponible"
        className="
        w-full h-48 
        sm:h-56
        md:h-64
        lg:h-72 
        object-cover rounded-2xl 
        transition-transform 
        duration-300 ease-in-out 
        group-hover:scale-105"
        style={{
          borderTopLeftRadius: "60px",
          borderTopRightRadius: "60px",
        }}
      />

      <div
        className="
      absolute bottom-0 left-0 w-full
      h-1/3 bg-gradient-to-t from-black/70 to-transparent 
      z-10 rounded-2xl"
      ></div>

      <div className="absolute bottom-2 left-3 z-20">
        <div className="flex items-baseline gap-2">
          <h2
            className="
            text-white 
            text-base sm:text-lg 
            font-semibold font-nunito"
          >
            {planta.nombre_cientifico}
          </h2>

          {/* Renderizado condicional de la cantidad de individuos */}
          {planta.cantidad && (
            <span className="text-white text-[10px] sm:text-xs font-light font-nunito opacity-90">
              ({planta.cantidad} individuos)
            </span>
          )}
        </div>

        <p
          className="
          text-white text-xs
          sm:text-sm
          font-light 
          font-nunito 
          hidden sm:block"
        >
          {planta.alias}
        </p>
      </div>
    </div>
  );
}