import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlantasPorEspacio } from "../../api/plantas.api";
import { getEspaciosUsuario } from "../../api/espacios.api";
import {
  getPlantaIndividuo,
  getTipoEstimulacion,
  getElectrodos,
  getMaterial,
  getPlagas,
} from "../../api/experimentos.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { ConfirmarGrabacion } from "../../components/modal/ConfirmarGrabacion";

export function RealizarExperimento() {
  const [espacios, setEspacios] = useState([]);
  const [espacioId, setEspacioId] = useState("");

  const [plantas, setPlantas] = useState([]);

  // Copia base y otra filtrada para IDs de planta (individuos)
  const [plantaIndAll, setPlantaIndAll] = useState([]);       // base
  const [plantaIndFiltered, setPlantaIndFiltered] = useState([]); // derivada

  const [tipoEsti, setTipoEsti] = useState([]);
  const [electrodos, setElectrodos] = useState([]);
  const [materiales, setMateriales] = useState([]);
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

  // Cargar catálogos base
  useEffect(() => {
    async function cargarDatosBase() {
      try {
        const [{ data: espaciosUsuario }, resPlantaInd, resTipoEsti, resElectrodos, resMaterial, resPlagas] =
          await Promise.all([
            getEspaciosUsuario(),
            getPlantaIndividuo(),
            getTipoEstimulacion(),
            getElectrodos(),
            getMaterial(),
            getPlagas(),
          ]);

        setEspacios(Array.isArray(espaciosUsuario) ? espaciosUsuario : []);
        setTipoEsti(resTipoEsti.data || []);
        setElectrodos(resElectrodos.data || []);
        setMateriales(resMaterial.data || []);
        setPlagas(resPlagas.data || []);

        // Base de individuos: ya filtrada por los espacios del usuario (si viene id_espacios)
        const idsEspaciosUsuario = new Set((espaciosUsuario || []).map((e) => e.id_espacios));
        const individuos = Array.isArray(resPlantaInd.data) ? resPlantaInd.data : [];
        const individuosFiltradosUsuario = individuos.filter((pi) =>
          pi?.id_espacios ? idsEspaciosUsuario.has(pi.id_espacios) : true
        );

        setPlantaIndAll(individuosFiltradosUsuario);      // base
        setPlantaIndFiltered(individuosFiltradosUsuario); // por defecto sin espacio seleccionado
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }

    cargarDatosBase();
  }, []);

  // Cuando cambia el espacio: cargar plantas y recalcular IDs usando la base (NO filtrar sobre el previo)
  useEffect(() => {
    async function actualizarPorEspacio() {
      // Reset selecciones dependientes
      setPlantaNombre("");
      setPlantaId("");

      if (!espacioId) {
        setPlantas([]);
        setPlantaIndFiltered(plantaIndAll); // sin espacio => muestra todos los que tenga el usuario
        return;
      }

      try {
        const { data } = await getPlantasPorEspacio(espacioId);
        setPlantas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar plantas del espacio:", error);
        setPlantas([]);
      }

      // Filtrado de IDs basado en la BASE
      const filtrados = plantaIndAll.filter((pi) =>
        pi?.id_espacios ? String(pi.id_espacios) === String(espacioId) : true
      );
      setPlantaIndFiltered(filtrados);
    }

    actualizarPorEspacio();
  }, [espacioId, plantaIndAll]);

  // Cambio en electrodos -> guarda ID y nombre del material
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

  // Helper para mostrar nombre del espacio
  const nombreEspacio = (e) =>
    (e?.nombre && String(e.nombre).trim()) ||
    (e?.nombre_espacio && String(e.nombre_espacio).trim()) ||
    `Espacio ${e.id_espacios}`;

  const espSel = espacios.find(e => String(e.id_espacios) === String(espacioId));
  const espacioNombre = espSel ? nombreEspacio(espSel) : "";

  const navState = {
    espacioNombre,
    plantaNombre,
    plantaId,
    tipoExperimento: tipoSeleccionado,
    materialElectrodosId,
    materialElectrodosNombre,
    tactoTipo,
    partePlanta,
    distancia,
    espacioId,
  };

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-4xl px-4 mx-auto mt-10">
        <h2 className="text-2xl font-baloo text-center mb-6 text-pl_green_b dark:text-pl_white_a">
          Experimento nuevo
        </h2>

        <form className="flex flex-col space-y-8 items-center w-full" onSubmit={(e) => e.preventDefault()}>

          {/* Contenedor planta */}
          <div className="relative w-full rounded-2xl border border-pl_green_b p-4">
            <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
              <span className="font-nunito text-pl_green_b dark:text-pl_white_a">Planta</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center mt-4">
              {/* Espacios */}
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Espacios</label>
                <select
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={espacioId}
                  onChange={(e) => setEspacioId(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione el espacio
                  </option>
                  {espacios.map((e) => (
                    <option key={e.id_espacios} value={e.id_espacios}>
                      {nombreEspacio(e)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Planta (filtrada por espacio) */}
              <div className="w-full max-w-md">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Planta</label>
                <select
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={plantaNombre}
                  onChange={(e) => setPlantaNombre(e.target.value)}
                  disabled={!espacioId}
                >
                  <option value="" disabled>
                    {espacioId ? "Seleccione la planta" : "Seleccione un espacio primero"}
                  </option>
                  {plantas.map((p) => (
                    <option key={p.id_planta} value={p.nombre_cientifico}>
                      {p.nombre_cientifico}
                    </option>
                  ))}
                </select>
              </div>

              {/* ID de la planta */}
              <div className="w-full max-w-md md:col-span-2">
                <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">ID de la planta</label>
                <select
                  className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                             font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                  value={plantaId}
                  onChange={(e) => setPlantaId(e.target.value)}
                  disabled={!espacioId}
                >
                  <option value="" disabled>
                    {espacioId ? "Seleccione ID de planta" : "Seleccione un espacio primero"}
                  </option>
                  {plantaIndFiltered.map((pi) => (
                    <option key={pi.id_PlantaIndividuo} value={pi.id_PlantaIndividuo}>
                      {pi.id_PlantaIndividuo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenedor experimento */}
          <div className="relative w-full rounded-2xl border border-pl_green_b p-4">
            <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
              <span className="font-nunito text-pl_green_b dark:text-pl_white_a">Experimento</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center mt-4">
              {/* Tipo de experimento */}
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
                  <option value="" disabled>
                    Seleccione tipo de experimento
                  </option>
                  {tipoEsti.map((te) => (
                    <option key={te.id_TipoEstimulacion} value={te.nombre}>
                      {te.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material de electrodos */}
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
                  <option value="" disabled>
                    Seleccione material de electrodos
                  </option>
                  {electrodos.map((e) => {
                    const material = materiales.find((m) => m.id_material === e.id_material);
                    return (
                      <option key={e.id_electrodos} value={e.id_electrodos}>
                        {material?.nombre ?? `Material #${e.id_material}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Campos adicionales para "Tacto" */}
              {tipoSeleccionado === "Tacto" && (
                <>
                  <div className="w-full max-w-md">
                    <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                      Tipo de tacto
                    </label>
                    <select
                      className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                 font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                      value={tactoTipo}
                      onChange={(e) => setTactoTipo(e.target.value)}
                    >
                      <option value="" disabled>
                        Seleccione tipo de tacto
                      </option>
                      {plagas.map((p) => (
                        <option key={p.id_plaga} value={p.alias}>
                          {p.alias}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full max-w-md">
                    <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                      Parte de la planta
                    </label>
                    <select
                      className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                 font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                      value={partePlanta}
                      onChange={(e) => setPartePlanta(e.target.value)}
                    >
                      <option value="" disabled>
                        Seleccione parte de la planta
                      </option>
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
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="button"
              className="bg-[#446957] dark:bg-[#54826C] hover:bg-[#3e5b4d]
                         text-pl_white_a py-3 px-8 rounded-full font-medium"
              onClick={handleAbrirModal}
            >
              Iniciar experimento
            </button>

            <ConfirmarGrabacion visible={mostrarModal} onCancelar={handleCancelar} navState={navState} />
          </div>
        </form>
      </div>
    </div>
  );
}