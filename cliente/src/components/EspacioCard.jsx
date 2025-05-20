import { useNavigate } from "react-router-dom";

export function EspacioCard({ espacio }) {
  const navigate = useNavigate();

  const imagenUrl = espacio.foto
    ? `${espacio.foto}`
    : "http://localhost:8000/media/espacios/default.jpg";

  //console.log("Imagen URL:", imagenUrl);  -> Verifica la URL

  return (
    <div
      onClick={() => {
        navigate(`/plantlist/verEspacio/${espacio.id_espacios}`);
      }}
    >
      <img
        src={imagenUrl}
        alt="No imagen disponivle"
        className="w-full h-60 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold text-center mt-2">
        {espacio.nombre_espacio}
      </h2>
    </div>
  );
}
