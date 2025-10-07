import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlantas, getPlantasPorEspacio } from "../../api/plantas.api";
import { getEspaciosUsuario } from "../../api/espacios.api"; 
import { getPlantaIndividuo, getTipoEstimulacion, getElectrodos, getMaterial, getPlagas } from "../../api/experimentos.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { ConfirmarGrabacion } from "../../components/modal/ConfirmarGrabacion";

export function RealizarExperimento() {
  const [plantas, setPlantas] = useState([]);
  const [plantaInd, setPlantaInd] = useState([]);
  const [tipoEsti, setTipoEsti] = useState([]);
  const [electrodos, setElectrodos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  // const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [plagas, setPlagas] = useState([]);

  // Estado del formulario
  const [plantaNombre, setPlantaNombre] = useState("");
  const [plantaId, setPlantaId] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [materialElectrodosId, setMaterialElectrodosId] = useState("");
  const [materialElectrodosNombre, setMaterialElectrodosNombre] = useState("");
  const [tactoTipo, setTactoTipo] = useState("");
  const [partePlanta, setPartePlanta] = useState("");
  const [distancia, setDistancia] = useState("");

  // Modal 
  const [mostrarModal, setMostrarModal] = useState(false);
  const handleAbrirModal = () => setMostrarModal(true);
  const handleCancelar = () => setMostrarModal(false);

  const navigate = useNavigate();

  // Limpiar campos específicos al cambiar tipo
  useEffect(() => {
    setTactoTipo("");
    setPartePlanta("");
    setDistancia("");
  }, [tipoSeleccionado]);

  // Catálogo
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Traer espacios del usuario activo
        const { data: espaciosUsuario } = await getEspaciosUsuario(); 

        // Si el usuario no tiene espacios, no habrá plantas que mostrar
        let plantasUsuario = [];
        if (Array.isArray(espaciosUsuario) && espaciosUsuario.length > 0) {
          // Traer plantas por cada espacio
          const respuestasPlantas = await Promise.all(
            espaciosUsuario.map((e) => getPlantasPorEspacio(e.id_espacios))
          );
          plantasUsuario = respuestasPlantas.flatMap((r) => r.data || []);
        }

        // Resto de catálogos
        const [resPlantaInd, resTipoEsti, resElectrodos, resMaterial, resPlagas] = await Promise.all([
          getPlantaIndividuo(),
          getTipoEstimulacion(),
          getElectrodos(),
          getMaterial(),
          getPlagas(),
        ]);

        // Setear estado
        setPlantas(plantasUsuario);

        // Filtra individuos por espacios del usuario
        const idsEspaciosUsuario = new Set((espaciosUsuario || []).map((e) => e.id_espacios));
        const individuos = Array.isArray(resPlantaInd.data) ? resPlantaInd.data : [];
        const individuosFiltrados = individuos.filter((pi) =>
          // Si el backend incluye pi.id_espacios, filtramos, si no, se deja tal cual
          pi?.id_espacios ? idsEspaciosUsuario.has(pi.id_espacios) : true
        );
        setPlantaInd(individuosFiltrados);

        setTipoEsti(resTipoEsti.data || []);
        setElectrodos(resElectrodos.data || []);
        setMateriales(resMaterial.data || []);
        setPlagas(resPlagas.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatos();
  }, []);

  // Cambio en electrodos, guarda ID y nombre del material
  const onChangeElectrodos = (e) => {
    const idElectro = e.target.value;
    setMaterialElectrodosId(idElectro);

    const elec = electrodos.find((el) => String(el.id_electrodos) === String(idElectro));
    if (elec) {
      const mat = materiales.find((m) => m.id_material === elec.id_material);
      setMaterialElectrodosNombre(mat ? mat.nombre : "");
    } else {
      setMaterialElectrodosNombre("");
    }
  };

  // Pase de datos (se pasa al modal, luego a CuentaRegresiva y ExperimentoProceso)
  const navState = {
    plantaNombre,
    plantaId,
    tipoExperimento: tipoSeleccionado,
    materialElectrodosId,
    materialElectrodosNombre,
    tactoTipo,
    partePlanta,
    distancia,
  };

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-4xl px-4 mx-auto mt-10">
        <h2 className="text-2xl font-baloo text-center mb-6 text-pl_green_b dark:text-pl_white_a">
          Experimento nuevo
        </h2>

        <form className="flex flex-col space-y-6 items-center w-full" onSubmit={(e) => e.preventDefault()} >
          {/* Grupo Planta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:mb-10 md:gap-x-15 w-full justify-items-center">
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                Planta
              </label>

              <select 
                className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                           font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                value={plantaNombre}
                onChange={(e) => setPlantaNombre(e.target.value)}
              >
                <option value="" disabled>Seleccione la planta</option>
                {plantas.map((p) => (
                  <option key={p.id_planta} value={p.nombre_cientifico}>
                    {p.nombre_cientifico}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                ID de la planta
              </label>

              <select 
                className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                           font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                value={plantaId}
                onChange={(e) => setPlantaId(e.target.value)}
              >
                <option value="" disabled>Seleccione ID de planta</option>
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
              <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                Tipo de experimento
              </label>

              <select 
                className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                           font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value)}
              >
                <option value="" disabled>Seleccione tipo de experimento</option>
                {tipoEsti.map((te) => (
                  <option key={te.id_TipoEstimulacion} value={te.nombre}>
                    {te.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                Material de electrodos
              </label>

              <select 
                className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                           font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                value={materialElectrodosId}
                onChange={onChangeElectrodos}
              >
                <option value="" disabled>Seleccione material de electrodos</option>
                {electrodos.map((e) => {
                  const material = materiales.find((m) => m.id_material === e.id_material);
                  return (
                    <option key={e.id_electrodos} value={e.id_electrodos}>
                      {material.nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Campos adicionales para "Tacto" */}
            {tipoSeleccionado === "Tacto" && (
              <>
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Tipo de tacto</label>

                <select 
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={tactoTipo}
                  onChange={(e) => setTactoTipo(e.target.value)}
                >
                  <option value="" disabled>Seleccione tipo de tacto</option>
                  {plagas.map((p) => (
                    <option key={p.id_plaga} value={p.alias}>
                      {p.alias}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Parte de la planta</label>

                <select 
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={partePlanta}
                  onChange={(e) => setPartePlanta(e.target.value)}
                >
                  <option value="" disabled>Seleccione parte de la planta</option>
                  <option>Hoja</option>
                  <option>Tallo</option>
                  <option>Flor</option>
                  <option>Raíz</option>
                </select>
              </div>
              </>
            )}

            {/* Campo adicional para "Proximidad" */}
            {tipoSeleccionado === "Proximidad" && (
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Distancia(m)</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ingrese distancia"
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={distancia}
                  onChange={(e) => setDistancia(e.target.value)}
                />
              </div>
            )}    

          </div>

          {/* Botón */}
          <div className="pt-4">
            <button
              type="button"
              className="bg-[#446957] dark:bg-[#54826C] hover:bg-[#3e5b4d]
                         text-pl_white_a py-3 px-8 rounded-full font-medium"
              onClick={handleAbrirModal}
            >
              Iniciar experimento
            </button>

            <ConfirmarGrabacion
              visible={mostrarModal}
              onCancelar={handleCancelar}
              navState={navState} 
            />  
          </div>
        </form>
      </div>
    </div>
  );
}
