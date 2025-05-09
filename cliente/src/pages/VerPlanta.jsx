import { getPlanta } from "../api/plantas.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Planta } from "../components/Planta";

export function VerPlanta() {
  const params = useParams();
  const [planta, setPlanta] = useState();

  useEffect(() => {
    async function cargarPlanta() {
      if (params.id) {
        const res = await getPlanta(params.id);
        setPlanta(res.data);
      }
    }
    cargarPlanta();
  }, []);

  if (!planta) return <p>Cargando...</p>;

  return <Planta planta={planta} key={planta.id} />;
}
