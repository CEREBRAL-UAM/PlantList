import { useEffect, useState } from "react";
import { EspecieCard } from "../components/EspecieCard";
import { getEspecies } from "../api/especies.api";

export function Especies() {
  const [especies, setEspecies] = useState([]);
  useEffect(() => {
    async function cargarEspecies() {
      const res = await getEspecies();
      setEspecies(res.data);
    }
    cargarEspecies();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
      {especies.map((especie) => (
        <EspecieCard especie={especie} key={especie.id_especies} />
      ))}
    </div>
  );
}
