import { useNavigate } from "react-router-dom";

export function EspecieCard({ especie }) {
  const navigate = useNavigate();

  const imagenUrl = especie.foto
    ? `${especie.foto}`
    : "http://localhost:8000/media/especies/default.jpg";

  //console.log("Imagen URL:", imagenUrl);  -> Verifica la URL

  return (
    <div
      onClick={() => {
        navigate(`/plantlist/plantas/${planta.id_planta}`); // IGNORAR, NO HACE NADA
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg group"
    >
      <img
        src={imagenUrl}
        alt="No imagen disponivle"
        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent z-10 rounded-2xl"></div>
      <h2 className="absolute bottom-3 left-4 text-white text-base sm:text-lg md:text-xl font-nunito z-20">
        {especie.nombre_cientifico}
      </h2>
    </div>
  );
}
