import { SecHeader } from "../components/SecHeader";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getEspacio } from "../api/espacios.api";

export function Colaboradores() {
  const { id_espacios } = useParams();
  const [espacio, setEspacio] = useState([]);

  useEffect(() => {
    async function cargarEspacio() {
      if (id_espacios) {
        const res = await getEspacio(id_espacios);
        setEspacio(res.data);
      }
    }
    cargarEspacio();
  }, []);

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <SecHeader />
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

      <h2
        className="
            text-md pt-6
            font-nunito text-black
            dark:text-pl_white_a
            text-center
      "
      >
        ¡Invita a colaborar en el espacio!
      </h2>
      <h1
        className="
            text-2xl font-bold
            text-center
            font-baloo text-pl_green_a 
        "
      >
        {espacio.clave_acceso}
      </h1>
      <p
        className="
            text-center text-xs
            text-gray-500
            
        "
      >
        Codigo de acceso
      </p>
      <div className="justify-center items-center flex">
        <div className="w-5xl pt-5">
          <h1
            className="
            text-lg font-bold
            font-nunito 
            text-black
        "
          >
            Administradores:
          </h1>

          <h1
            className="
            text-lg font-bold
            font-nunito 
            text-black
        "
          >
            Colaboradores:
          </h1>
        </div>
      </div>
    </div>
  );
}
