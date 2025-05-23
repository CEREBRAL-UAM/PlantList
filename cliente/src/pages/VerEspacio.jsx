import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlantasPorEspacio } from "../api/plantas.api";
import { getEspacio } from "../api/espacios.api";
import { PlantaCard } from "../components/PlantaCard";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function VerEspacio() {
  const navigate = useNavigate();
  const { id_espacios } = useParams();
  const [plantas, setPlantas] = useState([]);
  const [espacio, setEspacio] = useState([]);

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

  useEffect(() => {
    async function cargarEspacio() {
      if (id_espacios) {
        const res = await getEspacio(id_espacios);
        setEspacio(res.data);
      }
    }
    cargarEspacio();
  }, []);

  return (
    <div className="p-7">
      <h1 className="text-xl font-bold text-center mb-4">
        {espacio.nombre_espacio}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {plantas.map((planta) => (
          <PlantaCard planta={planta} key={planta.id_planta} />
        ))}
      </div>
      <button
        onClick={() =>
          navigate(`/plantlist/plantas/AgregarPlanta/${id_espacios}`)
        }
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg"
        aria-label="Agregar planta"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
