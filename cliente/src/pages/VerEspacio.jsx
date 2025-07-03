import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlantasPorEspacio } from "../api/plantas.api";
import { getEspacio } from "../api/espacios.api";
import { PlantaCard } from "../components/cards/PlantaCard";
import { BotonAgregar } from "../components/botones/BotonAgregar";
import { SecHeader } from "../components/SecHeader";
import { Buscador } from "../components/Buscador";

export function VerEspacio() {
  const { id_espacios } = useParams();
  const [plantas, setPlantas] = useState([]);
  const [espacio, setEspacio] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

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

  const plantasFiltradas = plantas.filter((planta) =>
    planta.nombre_cientifico
      .toLowerCase()
      .includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <div className="flex items-center">
        <SecHeader dir="/biolink_ipc/espacios" />
        <Buscador
          placeholder="Buscar planta por nombre"
          value={terminoBusqueda}
          onChange={setTerminoBusqueda}
        />
      </div>
      <h1
        className="
      text-xl font-bold
      text-center 
      font-nunito text-pl_green_b 
      uppercase
      dark:text-pl_white_a"
      >
        {espacio.nombre_espacio}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
        {plantasFiltradas.map((planta) => (
          <PlantaCard planta={planta} key={planta.id_planta} />
        ))}
      </div>

      <BotonAgregar
        dir={`/biolink_ipc/plantas/AgregarPlanta/${id_espacios}`}
        key={plantas.id_planta}
      />
    </div>
  );
}
