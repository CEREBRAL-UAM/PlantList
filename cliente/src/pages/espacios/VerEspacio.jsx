import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlantasPorEspacio } from "../../api/plantas.api";
import { getEspacio } from "../../api/espacios.api";
import { PlantaCard } from "../../components/cards/PlantaCard";
import { BotonAgregar } from "../../components/botones/BotonAgregar";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { Buscador } from "../../components/layout/Buscador";
import { motion, AnimatePresence } from "framer-motion";
import { BotonColab } from "../../components/botones/BotonColab";

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

  const plantasFiltradas = plantas.filter(
    (planta) =>
      planta.nombre_cientifico
        .toLowerCase()
        .includes(terminoBusqueda.toLowerCase()) ||
      planta.alias.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="lg:pt-2">
      <div className="flex items-center">
        <BannerUsuario />
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
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
          {plantasFiltradas.map((planta) => (
            <motion.div
              key={planta.id_planta}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PlantaCard planta={planta} key={planta.id_planta} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <BotonColab dir={`/biolink_ipc/colaboradores/${id_espacios}`} />
      <BotonAgregar
        dir={`/biolink_ipc/plantas/AgregarPlanta/${id_espacios}`}
        key={plantas.id_planta}
      />
    </div>
  );
}
