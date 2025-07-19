import { useEffect, useState } from "react";
import { getPlantas } from "../../api/plantas.api";
import { PlantaCard } from "../../components/cards/PlantaCard";

export function Plantas() {
  const [plantas, setPlantas] = useState([]);
  useEffect(() => {
    async function cargarPlantas() {
      const res = await getPlantas();
      setPlantas(res.data);
    }
    cargarPlantas();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
      {plantas.map((planta) => (
        <PlantaCard planta={planta} key={planta.id_planta} />
      ))}
    </div>
  );
}
