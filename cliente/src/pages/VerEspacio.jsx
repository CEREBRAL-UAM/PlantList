import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlantasPorEspacio } from "../api/plantas.api";
import { PlantaCard } from "../components/PlantaCard";

export function VerEspacio() {
  const { id_espacios } = useParams();
  const [plantas, setPlantas] = useState([]);

  useEffect(() => {
    async function cargarPlantas() {
      try {
        const res = await getPlantasPorEspacio(id_espacios);
        if (Array.isArray(res.data)) {
          setPlantas(res.data);
        } else {
          console.error("La respuesta no es un array:", res.data);
          setPlantas([]);
        }
      } catch (error) {
        console.error("Error al cargar plantas:", error);
        setPlantas([]);
      }
    }
    cargarPlantas();
  }, [id_espacios]);

  return (
    <div className="p-7">
      {plantas.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          No hay plantas registradas en este espacio 🌱
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plantas.map((planta) => (
            <PlantaCard planta={planta} key={planta.id_planta} />
          ))}
        </div>
      )}
    </div>
  );
}
