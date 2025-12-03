  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { getPlantasPorEspacio, getPartePlanta } from "../../api/plantas.api";
  import { getEspaciosUsuario } from "../../api/espacios.api";
  import {
    getPlantaIndividuo,
    getTipoEstimulacion,
    getElectrodos,
    getMaterial,
    getPlagas,
    getCircuitosPorEspacio
  } from "../../api/experimentos.api";
  import { BannerUsuario } from "../../components/layout/BannerUsuario";
  import { ConfirmarGrabacion } from "../../components/modal/ConfirmarGrabacion";

  export function RealizarExperimento() {
    // Espacios / plantas
    const [espacios, setEspacios] = useState([]);
    const [espacioId, setEspacioId] = useState("");
    const [plantas, setPlantas] = useState([]);

    // Individuos (base y filtrado)
    const [plantaIndAll, setPlantaIndAll] = useState([]);
    const [plantaIndFiltered, setPlantaIndFiltered] = useState([]);

    // Circuitos
    const [circuitos, setCircuitos] = useState([]);
    const [circuitoBluetooth, setCircuitoBluetooth] = useState("");
    const [circuitoLabel, setCircuitoLabel] = useState("");

    // Catálogos
    const [tipoEsti, setTipoEsti] = useState([]);
    const [electrodos, setElectrodos] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [plagas, setPlagas] = useState([]);
    const [partesPlanta, setPartesPlanta] = useState([]); 

    // Formulario
    const [plantaNombre, setPlantaNombre] = useState("");
    const [plantaId, setPlantaId] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [materialElectrodosId, setMaterialElectrodosId] = useState("");
    const [materialElectrodosNombre, setMaterialElectrodosNombre] = useState("");
    const [plagaTipo, setPlagaTipo] = useState("");
    const [partePlanta, setPartePlanta] = useState(""); 
    const [distancia, setDistancia] = useState("");

    // Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const handleAbrirModal = () => setMostrarModal(true);
    const handleCancelar = () => setMostrarModal(false);

    const navigate = useNavigate();

    // Reset de campos dependientes cuando cambia el tipo
    useEffect(() => {
      setPlagaTipo("");
      setPartePlanta("");
      setDistancia("");
    }, [tipoSeleccionado]);

    // Cargar catálogos base 
    useEffect(() => {
      async function cargarDatosBase() {
        try {
          const [
            { data: espaciosUsuario },
            resPlantaInd,
            resTipoEsti,
            resElectrodos,
            resMaterial,
            resPlagas,
            resPartesPlanta,
          ] = await Promise.all([
            getEspaciosUsuario(),
            getPlantaIndividuo(),
            getTipoEstimulacion(),
            getElectrodos(),
            getMaterial(),
            getPlagas(),
            getPartePlanta(), 
          ]);

          setEspacios(Array.isArray(espaciosUsuario) ? espaciosUsuario : []);
          setTipoEsti(resTipoEsti?.data || []);
          setElectrodos(resElectrodos?.data || []);
          setMateriales(resMaterial?.data || []);
          setPlagas(resPlagas?.data || []);
          setPartesPlanta(resPartesPlanta?.data || []); 

          // Filtra individuos por espacios del usuario (si aplica)
          const idsEspaciosUsuario = new Set((espaciosUsuario || []).map((e) => e.id_espacios));
          const individuos = Array.isArray(resPlantaInd?.data) ? resPlantaInd.data : [];
          const individuosFiltradosUsuario = individuos.filter((pi) =>
            pi?.id_espacios ? idsEspaciosUsuario.has(pi.id_espacios) : true
          );

          setPlantaIndAll(individuosFiltradosUsuario);
          setPlantaIndFiltered(individuosFiltradosUsuario);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
      }

      cargarDatosBase();
    }, []);

    // Cuando cambia el espacio,recarga plantas y recalcula individuos desde la base
    useEffect(() => {
      async function actualizarPorEspacio() {
        // Reset selecciones de planta
        setPlantaNombre("");
        setPlantaId("");
        setCircuitos([]);
        setCircuitoBluetooth("");
        setCircuitoLabel("");

        if (!espacioId) {
          setPlantas([]);
          setPlantaIndFiltered(plantaIndAll);
          return;
        }

        try {
          const { data } = await getPlantasPorEspacio(espacioId);
          setPlantas(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error al cargar plantas del espacio:", error);
          setPlantas([]);
        }

        try {
          const { data } = await getCircuitosPorEspacio(espacioId);
          setCircuitos(Array.isArray(data?.results) ? data.results : []);
        } catch (error) {
          console.error("Error al cargar circuitos del espacio:", error);
          setCircuitos([]);
        }

        const filtrados = plantaIndAll.filter((pi) =>
          pi?.id_espacios ? String(pi.id_espacios) === String(espacioId) : true
        );
        setPlantaIndFiltered(filtrados);
      }

      actualizarPorEspacio();
    }, [espacioId, plantaIndAll]);

    // Cambio en electrodos 
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

    // Helper para nombre del espacio
    const nombreEspacio = (e) =>
      (e?.nombre && String(e.nombre).trim()) ||
      (e?.nombre_espacio && String(e.nombre_espacio).trim()) ||
      `Espacio ${e.id_espacios}`;

    const espSel = espacios.find((e) => String(e.id_espacios) === String(espacioId));
    const espacioNombre = espSel ? nombreEspacio(espSel) : "";

    // Helper para nombre de la parte de planta 
    const nombreParte = (pp) =>
      (pp?.Nombre_Cientifico && String(pp.Nombre_Cientifico).trim()) ||
      (pp?.nombre_cientifico && String(pp.nombre_cientifico).trim()) ||
      (pp?.Alias && String(pp.Alias).trim()) ||
      (pp?.alias && String(pp.alias).trim()) ||
      (pp?.Nombre && String(pp.Nombre).trim()) ||
      `Parte #${pp?.id_PartePlanta ?? ""}`;

    // Parte de planta seleccionada (a partir del id guardado en estado `partePlanta`)
    const partePlantaObj = partesPlanta.find(
      (pp) => String(pp.id_PartePlanta) === String(partePlanta)
    );
    const partePlantaNombre = partePlantaObj ? nombreParte(partePlantaObj) : "";

    const isProx  = tipoSeleccionado === "Proximidad";
    const isPlaga = tipoSeleccionado === "Plagas";

    const navState = {
      // Siempre
      espacioNombre,
      plantaNombre,
      plantaId,
      tipoEstimulacion: tipoSeleccionado,
      circuitoBluetooth,
      circuitoLabel,
      materialElectrodosNombre,

      // Solo si es Proximidad
      ...(isProx ? { distancia } : {}),

      // Solo si no es Proximidad (cubre Tacto, Plagas, etc.)
      ...(!isProx ? { partePlanta: partePlantaNombre, partePlantaId: partePlanta } : {}),

      // Solo si es Plagas
      ...(isPlaga ? { plagaTipo } : {}),
    };

    return (
      <div className="min-h-screen flex flex-col lg:pt-2">
        <BannerUsuario />

        <div className="w-full max-w-4xl px-4 mx-auto mt-10">
          <h2 className="text-2xl font-baloo text-center mb-6 text-pl_green_b dark:text-pl_white_a">
            Experimento nuevo
          </h2>

          <form className="flex flex-col space-y-8 items-center w-full" onSubmit={(e) => e.preventDefault()}>
            {/* Contenedor espacios */}
            <div className="relative w-full rounded-2xl border border-pl_green_b p-4">
              <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
                <span className="font-nunito text-pl_green_b dark:text-pl_white_a">Espacio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center mt-4">
                <div className="w-full max-w-md md:col-span-2">
                  <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">Seleccione el espacio</label>
                  <select
                    className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                              font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                    value={espacioId}
                    onChange={(e) => setEspacioId(e.target.value)}
                  >
                    <option value="" disabled>Seleccione el espacio</option>
                    {espacios.map((e) => (
                      <option key={e.id_espacios} value={e.id_espacios}>
                        {nombreEspacio(e)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contenedor planta */}
            <div className="relative w-full rounded-2xl border border-pl_green_b p-4">
              <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
                <span className="font-nunito text-pl_green_b dark:text-pl_white_a">Planta</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center mt-4">
                {/* Planta (por espacio) */}
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

                {/* ID de la planta (individuos) */}
                <div className="w-full max-w-md">
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

              {/*
                Helpers de UI
              */}
              {(() => {
                const isProx = tipoSeleccionado === "Proximidad";
                const isPlaga = tipoSeleccionado === "Plagas";
                const showParte = !!tipoSeleccionado && !isProx && !isPlaga; 

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center mt-4">

                    {/* Tipo de estimulación */}
                    <div className="w-full max-w-md">
                      <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                        Tipo de estimulación
                      </label>
                      <select
                        className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                  font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value)}
                      >
                        <option value="" disabled>Seleccione tipo de estimulación</option>
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
                        <option value="" disabled>Seleccione material de electrodos</option>
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

                    {/* Circuito */}
                    <div className="w-full max-w-md">
                      <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                        Circuito
                      </label>
                      <select
                        className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                  font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                        value={circuitoBluetooth}
                        onChange={(e) => {
                          const bluetooth = e.target.value;
                          setCircuitoBluetooth(bluetooth);

                          // Busca el circuito seleccionado
                          const c = circuitos.find((x) => x.bluetooth === bluetooth);
                          // Crea el label legible igual que en el select
                          const label = c ? `${c.tipo || "Circuito"}${c.bluetooth ? " · " + c.bluetooth : ""}` : "";
                          setCircuitoLabel(label);
                        }}
                        disabled={!espacioId || !circuitos.length}
                      >
                        <option value="" disabled>
                          {espacioId ? "Seleccione el circuito" : "Seleccione un espacio primero"}
                        </option>
                        {circuitos.map((c) => (
                          <option key={c.bluetooth} value={c.bluetooth}>
                            {`${c.tipo || "Circuito"}${c.bluetooth ? " · " + c.bluetooth : ""}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Distancia (solo si es proximidad) */}
                    {isProx && (
                      <div className="w-full max-w-md">
                        <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                          Distancia (m)
                        </label>
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

                    {/* Tipo de plaga (solo si es plagas) */}
                    {isPlaga && (
                      <div className="w-full max-w-md">
                        <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                          Tipo de plaga
                        </label>
                        <select
                          className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                    font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                          value={plagaTipo}
                          onChange={(e) => setPlagaTipo(e.target.value)}
                        >
                          <option value="" disabled>Seleccione tipo de plaga</option>
                          {plagas.map((p) => (
                            <option key={p.id_plaga} value={p.alias}>
                              {p.alias}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Parte de la planta */}
                    {showParte && (
                      <div className="w-full max-w-md">
                        <label className="block mb-2 font-nunito text-pl_green_b dark:text-pl_white_a">
                          Parte de la planta
                        </label>
                        <select
                          className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80
                                    font-nunito rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none"
                          value={partePlanta}
                          onChange={(e) => setPartePlanta(e.target.value)}
                          disabled={!partesPlanta.length}
                        >
                          <option value="" disabled>Seleccione parte de la planta</option>
                          {partesPlanta.map((pp) => (
                            <option key={pp.id_PartePlanta} value={pp.id_PartePlanta}>
                              {pp.Nombre_Cientifico || pp.nombre_cientifico || pp.alias || `Parte #${pp.id_PartePlanta}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Botón + modal */}
            <div className="pt-2">
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
