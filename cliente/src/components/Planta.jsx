import { eliminarPlanta } from "../api/plantas.api";
import { useNavigate } from "react-router-dom";

export function Planta({ planta }) {
  const navigate = useNavigate();
  const imagenUrl = planta.foto
    ? `${planta.foto}`
    : "http://localhost:8000/media/plantas/default.jpg";

  return (
    <div className="max-w-lg mx-auto  p-6 rounded-lg ">
      <h1 className="text-2xl font-bold">{planta.nombre_cientifico}</h1>
      <h2 className="text-2xl">Alias: {planta.alias}</h2>
      <p className="text-gray-600">Descripción: {planta.descripcion}</p>
      <p className="text-gray-600">Especie: {planta.id_especies}</p>
      <p className="text-gray-600">Familia: {planta.familia}</p>

      <img
        src={imagenUrl}
        alt="imagen no dispobible"
        className="mt-4 rounded-lg w-full"
      />

      <button
        className="mx-auto  block pt-10 hover:text-gray-500"
        onClick={async () => {
          const acepted = window.confirm(
            "¿Estas segur@ q quieres borrar esta planta?"
          );

          if (acepted) {
            await eliminarPlanta(planta.id_planta);
            navigate("/plantlist/plantas");
          }
        }}
      >
        Eliminar planta
      </button>

      <button className="mx-auto  block pt-10 hover:text-gray-500">
        Ver partes
      </button>
    </div>
  );
}
