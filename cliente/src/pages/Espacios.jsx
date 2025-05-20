import { useEffect, useState } from "react";
import { getEspacios } from "../api/espacios.api";
import { EspacioCard } from "../components/EspacioCard";

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
      <h1 className="text-xl font-bold text-center mt-2">MIS ESPACIOS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
        {espacios.map((espacio) => (
          <EspacioCard espacio={espacio} key={espacio.id_espacios} />
        ))}
      </div>
    </div>
  );
}
