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
    >
      <img
        src={imagenUrl}
        alt="No imagen disponivle"
        className="w-full h-60 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold text-center mt-2">
        {especie.nombre_cientifico}
      </h2>
    </div>
  );
}
