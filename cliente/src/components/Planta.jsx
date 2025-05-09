import { eliminarPlanta } from "../api/plantas.api";
import { useNavigate } from "react-router-dom";

export function Planta({ planta }) {
  const navigate = useNavigate();
  const imagenUrl = planta.imagen
    ? `${planta.imagen}`
    : "http://localhost:8000/media/plantas/default.jpg";

  return (
    <div className="max-w-lg mx-auto  p-6 rounded-lg ">
      <h1 className="text-2xl font-bold">{planta.nombre}</h1>
      <p className="text-gray-600">Descripción: {planta.descripcion}</p>
      <p className="text-gray-600">Especie: {planta.especie}</p>

      <img
        src={imagenUrl}
        alt="imagen no dispobible"
        className="mt-4 rounded-lg w-full"
      />

      <p className="text-sm text-gray-500 mt-2">
        Agregada el: {new Date(planta.fecha_registro).toLocaleDateString()}
      </p>

      <button
        className="mx-auto  block pt-10"
        onClick={async () => {
          const acepted = window.confirm(
            "¿Estas segur@ q quieres borrar esta planta?"
          );

          if (acepted) {
            await eliminarPlanta(planta.id);
            navigate("/plantlist/plantas");
          }
        }}
      >
        Eliminar planta
      </button>
    </div>
  );
}
