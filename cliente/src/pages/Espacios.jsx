import { useEffect, useState } from "react";
import { getEspacios } from "../api/espacios.api";
import { EspacioCard } from "../components/EspacioCard";
import { BotonAgregar } from "../components/BotonAgregar";

export function Espacios() {
  const [espacios, setEspacios] = useState([]);
  useEffect(() => {
    async function cargarEspacios() {
      const res = await getEspacios();
      setEspacios(res.data);
    }
    cargarEspacios();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
        MIS ESPACIOS
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
        {espacios.map((espacio) => (
          <EspacioCard espacio={espacio} key={espacio.id_espacios} />
        ))}
      </div>

      <BotonAgregar
        dir="/plantlist/AgregarEspacio"
        key={espacios.id_espacios}
      />
    </div>
  );
}
