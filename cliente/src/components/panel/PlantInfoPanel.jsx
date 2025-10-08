import { useEffect, useState } from "react";
import { getEspaciosUsuario } from "../../api/espacios.api";
import { getPlantasPorEspacio } from "../../api/plantas.api";
import { getPlantaIndividuo } from "../../api/experimentos.api";

export function PlantInfoPanel() {
  const [plantas, setPlantas] = useState([]);
  const [plantaInd, setPlantaInd] = useState([]);

  const [plantaNombre, setPlantaNombre] = useState("");
  const [plantaId, setPlantaId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Traer espacios del usuario activo
        const { data: espaciosUsuario } = await getEspaciosUsuario(); 

        // Si el usuario no tiene espacios, no habrá plantas que mostrar
        let plantasUsuario = [];
        if (Array.isArray(espaciosUsuario) && espaciosUsuario.length > 0) {
          // Traer plantas por cada espacio
          const respuestasPlantas = await Promise.all(
            espaciosUsuario.map((e) => getPlantasPorEspacio(e.id_espacios))
          );
          plantasUsuario = respuestasPlantas.flatMap((r) => r.data || []);
        }
        setPlantas(plantasUsuario);

        
        const resPlantaInd = await getPlantaIndividuo();
        // Filtra individuos por espacios del usuario
        const idsEspaciosUsuario = new Set((espaciosUsuario || []).map((e) => e.id_espacios));
        const individuos = Array.isArray(resPlantaInd.data) ? resPlantaInd.data : [];
        const individuosFiltrados = individuos.filter((pi) =>
          // Si el backend incluye pi.id_espacios, filtramos, si no, se deja tal cual
          pi?.id_espacios ? idsEspaciosUsuario.has(pi.id_espacios) : true
        );
        setPlantaInd(individuosFiltrados);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    })();
  }, []);

  return (
    <div
      className="
      absolute w-full md:w-80
      rounded-3xl border border-pl_green_b
      p-4 shadow-xl"
    >
      <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
        <span className="text-xl font-baloo text-pl_green_b dark:text-pl_white_a">
          Información
        </span>
      </div>

      {/* Sección Planta */}
      <div className="relative mt-6 rounded-2xl border border-pl_green_b p-4 mb-7">
        <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="font-nunito text-pl_green_b dark:text-pl_white_a">
            Planta
          </span>
        </div>

        {/* Fila Planta */}
        <Row
          label="Planta"
          value={
            <select
              className="bg-pl_green_input dark:bg-[#A3AE9A] 
                         text-pl_green_b/80 font-nunito rounded-xl 
                         py-1 px-2 ml-2"
              value={plantaNombre}
              onChange={(e) => setPlantaNombre(e.target.value)}
            >
              <option value="" disabled>
                Planta
              </option>
              {plantas.map((p) => (
                <option key={p.id_planta} value={p.nombre_cientifico}>
                  {p.nombre_cientifico}
                </option>
              ))}
            </select>
          }
        />

        {/* Fila ID Planta */}
        <Row
          label="Id Planta"
          value={
            <select
              className="bg-pl_green_input dark:bg-[#A3AE9A] 
                         text-pl_green_b/80 font-nunito rounded-xl 
                         py-1 px-2 ml-2"
              value={plantaId}
              onChange={(e) => setPlantaId(e.target.value)}
            >
              <option value="" disabled>
                ID
              </option>
              {plantaInd.map((pi) => (
                <option key={pi.id_PlantaIndividuo} value={pi.id_PlantaIndividuo}>
                  {pi.id_PlantaIndividuo}
                </option>
              ))}
            </select>
          }
        />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm text-pl_green_b dark:text-pl_white_a">
      <span className="font-nunito">{label}:</span>
      <div className="flex-1">{value}</div>
    </div>
  );
}