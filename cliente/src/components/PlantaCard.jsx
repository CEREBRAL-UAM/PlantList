import { useNavigate } from "react-router-dom";

export function PlantaCard({ planta }) {
  const navigate = useNavigate();

  const imagenUrl = planta.foto
    ? `${planta.foto}`
    : "http://localhost:8000/media/plantas/default.jpg";

  //console.log("Imagen URL:", imagenUrl);  -> Verifica la URL

  return (
    <div
      onClick={() => {
        navigate(`/plantlist/plantas/${planta.id_planta}`);
      }}
    >
      <img
        src={imagenUrl}
        alt="No imagen disponivle"
        className="w-full h-60 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold text-center mt-2">
        {planta.nombre_cientifico}
      </h2>
      <p className="text-gray-600 text-justify mt-2">{planta.descripcion}</p>
    </div>
  );
}
