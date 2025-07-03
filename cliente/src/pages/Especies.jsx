import { useEffect, useState } from "react";
import { EspecieCard } from "../components/cards/EspecieCard";
import { getEspecies } from "../api/especies.api";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { SecHeader } from "../components/SecHeader";
import { Buscador } from "../components/Buscador";

export function Especies() {
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  useEffect(() => {
    async function cargarEspecies() {
      const res = await getEspecies();
      setEspecies(res.data);
    }
    cargarEspecies();
  }, []);

  const especiesFiltradas = especies.filter((especie) =>
    especie.nombre_cientifico
      .toLowerCase()
      .includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="pt-15">
      <div className="flex items-center">
        <SecHeader />
        <Buscador
          placeholder="Buscar especie por nombre"
          value={terminoBusqueda}
          onChange={setTerminoBusqueda}
        />
      </div>
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
        ESPECIES
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-7">
        {especiesFiltradas.map((especie) => (
          <EspecieCard especie={especie} key={especie.id_especies} />
        ))}
        <button
          onClick={() => navigate("/plantlist/especies/AgregarEspecie")}
          className="fixed bottom-6 right-6 bg-pl_green_a text-white rounded-full p-5 shadow-lg"
          aria-label="Agregar especie"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
