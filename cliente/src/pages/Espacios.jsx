import { useEffect, useState } from "react";
import { getEspaciosUsuario } from "../api/espacios.api";
import { EspacioCard } from "../components/cards/EspacioCard";
import { BotonAgregar } from "../components/botones/BotonAgregar";
import { motion, AnimatePresence } from "framer-motion";

export function Espacios() {
  const [espacios, setEspacios] = useState([]);

  async function cargarEspacios() {
    const res = await getEspaciosUsuario();
    setEspacios(res.data);
  }

  useEffect(() => {
    cargarEspacios();
  }, []);

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b dark:text-pl_white_a">
        MIS ESPACIOS
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
        <AnimatePresence>
          {espacios.map((espacio) => (
            <motion.div
              key={espacio.id_espacios}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <EspacioCard espacio={espacio} onDelete={cargarEspacios} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <BotonAgregar dir="/biolink_ipc/AgregarEspacio" />
    </div>
  );
}
