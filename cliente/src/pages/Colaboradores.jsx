import { SecHeader } from "../components/SecHeader";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getEspacio } from "../api/espacios.api";
import { getColaboradores } from "../api/espacios.api";
import { Colaborador } from "../components/cards/Colaborador";

export function Colaboradores() {
  const { id_espacios } = useParams();
  const [espacio, setEspacio] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    async function cargarColaboradores() {
      if (id_espacios) {
        const admins = await getColaboradores(id_espacios, 1); // obtenemos admins
        setAdministradores(admins.data);

        const colabs = await getColaboradores(id_espacios, 0); // obtenemos colaboradores
        setColaboradores(colabs.data);
      }
    }
    cargarColaboradores();
  }, []);

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
            dark:text-pl_white_a
            pt-12
        "
          >
            Administradores:
          </h1>
          <div className="flex gap-2">
            {administradores.map((usuario) => (
              <Colaborador usuario={usuario} key={usuario.id_Usuario} />
            ))}
          </div>
          <h1
            className=" 
            text-lg font-bold
            font-nunito 
            text-black
            dark:text-pl_white_a
            pt-12
        "
          >
            Colaboradores:
          </h1>
          <div className="flex gap-2">
            {colaboradores.map((usuario) => (
              <Colaborador usuario={usuario} key={usuario.id_Usuario} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
