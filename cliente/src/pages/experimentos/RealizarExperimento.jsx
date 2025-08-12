import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlantas } from "../../api/plantas.api";
import { getPlantaIndividuo, getTipoEstimulacion, getElectrodos, getMaterial, getPlagas } from "../../api/experimentos.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function RealizarExperimento() {
  const [plantas, setPlantas] = useState([]);
  const [plantaInd, setPlantaInd] = useState([]);
  const [tipoEsti, setTipoEsti] = useState([]);
  const [electrodos, setElectrodos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [plagas, setPlagas] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
      const [resPlantas, resPlantaInd, resTipoEsti, resElectrodos, resMaterial, resPlagas] = await Promise.all([
        getPlantas(),
        getPlantaIndividuo(),
        getTipoEstimulacion(),
        getElectrodos(),
        getMaterial(),
        getPlagas(),
      ]);
      console.log("Electrodos:", resElectrodos.data);
      console.log("Materiales:", resMaterial.data);

      setPlantas(resPlantas.data);
      setPlantaInd(resPlantaInd.data);
      setTipoEsti(resTipoEsti.data);
      setElectrodos(resElectrodos.data);
      setMateriales(resMaterial.data);
      setPlagas(resPlagas.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-4xl px-4 mx-auto mt-10">
        <h2 className="text-2xl font-baloo text-center mb-6 text-[#264313] dark:text-[#F3EEEA]">
          Experimento nuevo
        </h2>

        <form className="flex flex-col space-y-6 items-center w-full">
          {/* Grupo Planta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:mb-10 md:gap-x-15 w-full justify-items-center">
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Planta
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>Seleccione la planta</option>
                {plantas.map((p) => (
                  <option key={p.id_planta} value={p.id_planta}>
                    {p.nombre_cientifico}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                ID de la planta
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>Seleccione ID de planta</option>
                {plantaInd.map((pi) => (
                  <option key={pi.id_PlantaIndividuo } value={pi.id_PlantaIndividuo }>
                    {pi.id_PlantaIndividuo }
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grupo Experimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center">
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Tipo de experimento
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]"
              onChange={(e) => setTipoSeleccionado(e.target.value)}>
                <option disabled selected>Seleccione tipo de experimento</option>
                {tipoEsti.map((te) => (
                  <option key={te.id_TipoEstimulacion} value={te.nombre}>
                    {te.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Material de electrodos
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]"
              onChange={(e) => setTipoSeleccionado(e.target.value)}>
                <option disabled selected>Seleccione material de electrodos</option>
                {electrodos.map((e) => {
                  const material = materiales.find((m) => m.id_material === e.id_material);
                  return (
                    <option key={e.id_electrodos} value={e.id_electrodos}>
                      {material ? material.nombre : "Material desconocido"}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Campos adicionales para "Tacto" */}
            {tipoSeleccionado === "Tacto" && (
              <>
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">Tipo de tacto</label>
                <select 
                  className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]"
                >
                <option disabled selected>Seleccione tipo de tacto</option>
                {plagas.map((p) => (
                  <option key={p.id_plaga} value={p.id_plaga}>
                    {p.alias}
                  </option>
                ))}
                </select>
              </div>
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">Parte de la planta</label>
                <select 
                  className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]"
                >
                <option disabled selected>Seleccione parte de la planta</option>
                <option>Opción</option>
                </select>
              </div>
              </>
            )}

            {/* Campo adicional para "Proximidad" */}
            {tipoSeleccionado === "Proximidad" && (
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">Distancia(m)</label>
                <input
                  type="number"
                  placeholder="Ingrese distancia"
                  className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#264313] rounded-2xl py-3 px-5 w-full drop-shadow-xl border border-[#446957]"
                />
              </div>
            )}  

          </div>

          {/* Botón */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#446957] hover:bg-[#3e5b4d] text-white py-3 px-8 rounded-full font-medium"
            >
              Iniciar experimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
