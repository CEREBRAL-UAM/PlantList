import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { PlantInfoPanel } from "../../components/panel/PlantInfoPanel";
import { sensorTiempoReal } from "../../api/sensorTiempoReal";
import { getEspaciosUsuario } from "../../api/espacios.api";
import { getPlantasPorEspacio } from "../../api/plantas.api";
import { getPlantaIndividuo } from "../../api/experimentos.api";

// Ticks para el eje Y y la cuadrícula
const TICKS_Y = [0, 20, 40, 60, 80, 100];

export function MonitorearPlanta() {
  const [modo, setModo] = useState("amperaje");
  const navigate = useNavigate();

  // Espacios / plantas
  const [espacios, setEspacios] = useState([]);
  const [espacioId, setEspacioId] = useState("");
  const [plantas, setPlantas] = useState([]);

  // Individuos
  const [plantaIndAll, setPlantaIndAll] = useState([]);
  const [plantaIndFiltered, setPlantaIndFiltered] = useState([]);

  // Selección
  const [plantaSeleccionadaId, setPlantaSeleccionadaId] = useState("");
  const [plantaId, setPlantaId] = useState("");

  // Datos en tiempo real
  const datosHumedad = sensorTiempoReal();
  const humedadActual =
    datosHumedad.length > 0
      ? datosHumedad[datosHumedad.length - 1].value
      : null;

  // Sensores
  const sensores = [
    { id: "tempAmb", label: "Temp Amb" },
    { id: "tempHum", label: "Temp Hum" },
    { id: "ph", label: "PH" },
    { id: "humTierra", label: "Hum Tierra" },
  ];

  const valoresSensores = {
    humTierra: humedadActual !== null ? humedadActual : "—",
    tempAmb: "0",
    tempHum: "0",
    ph: "0",
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [{ data: espaciosUsuario }, resPlantaInd] =
          await Promise.all([
            getEspaciosUsuario(),
            getPlantaIndividuo(),
          ]);

        setEspacios(espaciosUsuario ?? []);
        setPlantaIndAll(resPlantaInd?.data ?? []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }

    cargarDatos();
  }, []);

  // Cambio de espacio
  useEffect(() => {
    async function actualizarEspacio() {
      setPlantaSeleccionadaId("");
      setPlantaId("");
      setPlantaIndFiltered([]);

      if (!espacioId) {
        setPlantas([]);
        return;
      }

      try {
        const { data } = await getPlantasPorEspacio(espacioId);
        setPlantas(data ?? []);
      } catch (error) {
        console.error("Error cargando plantas:", error);
      }

      const filtrados = plantaIndAll.filter(
        (pi) => String(pi.id_espacios) === String(espacioId)
      );

      setPlantaIndFiltered(filtrados);
    }

    actualizarEspacio();
  }, [espacioId, plantaIndAll]);

  // Cambio de planta
  useEffect(() => {
    if (!plantaSeleccionadaId) {
      const filtrados = plantaIndAll.filter(
        (pi) => String(pi.id_espacios) === String(espacioId)
      );
      setPlantaIndFiltered(filtrados);
      return;
    }

    const filtrados = plantaIndAll.filter(
      (pi) =>
        String(pi.id_espacios) === String(espacioId) &&
        String(pi.id_planta) === String(plantaSeleccionadaId)
    );

    setPlantaIndFiltered(filtrados);
    setPlantaId("");
  }, [plantaSeleccionadaId, espacioId, plantaIndAll]);

  // Planta individuo seleccionado 
  const plantaSeleccionada = plantaIndFiltered.find(
    (pi) => String(pi.id_PlantaIndividuo) === String(plantaId)
  );

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full px-4 mx-auto mt-10">
        <h1 className="text-center text-2xl font-bold font-nunito text-pl_green_b dark:text-pl_white_a mb-6">
        MONITOREO DE PLANTA
        </h1>

        <div className="min-h-screen w-full flex items-start py-6 px-6 lg:px-16">
          
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-10">

            {/* Panel de información */}
            <div className="md:col-span-1 flex">
              <PlantInfoPanel
                espacios={espacios}
                espacioId={espacioId}
                setEspacioId={setEspacioId}
                plantas={plantas}
                plantaInd={plantaIndFiltered}
                plantaSeleccionadaId={plantaSeleccionadaId}
                setPlantaSeleccionadaId={setPlantaSeleccionadaId}
                plantaId={plantaId}
                setPlantaId={setPlantaId}
                plantaSeleccionada={plantaSeleccionada}
              />
            </div>

            {/* Área principal */}
            <div className="md:col-span-2 w-full flex flex-col md:ml-5">

              {/* Chips de sensores */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {sensores.map((s) => (
                  <div
                    key={s.id}
                    className="px-5 py-2 rounded-xl bg-[#cccccc] text-gray-800 text-sm font-nunito shadow-sm
                      flex flex-col items-center min-w-[110px]"
                  >
                    <span>{s.label}</span>
                    <span className="text-xs text-gray-600 mt-1">
                      {valoresSensores[s.id] ?? "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Gráfica y botones */}
              <div className="min-h-\[320px]\ flex flex-col md:flex-row gap-8 mt-2">

                {/* Gráfica */}
                <div className="flex-1 flex flex-col min-h-\[320px]\ p-4">
                  <div className="relative flex-1 pt-8 pb-6">
                    <div className="absolute inset-0 flex flex-col-reverse justify-between">
                      {TICKS_Y.map((v, idx) => (
                        <div key={v} className="flex items-center">
                          <span className="w-10 text-[0.7rem] text-gray-500 text-right mr-2">
                            {v}
                          </span>
                          <div
                            className={
                              idx === 0
                                ? "flex-1 border-t-2 border-gray-500"
                                : "flex-1 border-t border-gray-300"
                            }
                          />
                        </div>
                      ))}
                    </div>

                    {/* Línea en la gráfica */}
                    <div className="absolute inset-y-0 right-0 left-12">
                      <LineaHumedad data={datosHumedad} />
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="w-full md:w-40 flex md:flex-col gap-3 justify-start md:justify-center items-center">
                  <button
                    onClick={() => setModo("iluminacion")}
                    className={`w-40 h-10 rounded-full text-sm font-nunito transition
                      ${
                        modo === "iluminacion"
                          ? "bg-pl_green_b text-pl_white_b"
                          : "bg-[#93a189] text-[#243824]"
                      }`}
                  >
                    Iluminación
                  </button>

                  <button
                    onClick={() => setModo("solar")}
                    className={`w-40 h-10 rounded-full text-sm font-nunito transition
                      ${
                        modo === "solar"
                          ? "bg-pl_green_a text-pl_white_b"
                          : "bg-[#cfe5e2] text-[#3f6f6a]"
                      }`}
                  >
                    Radiación solar
                  </button>

                  <button
                    onClick={() => setModo("potencial")}
                    className={`w-40 h-10 rounded-full text-sm font-nunito transition
                      ${
                        modo === "potencial"
                          ? "bg-pl_green_c text-pl_white_b"
                          : "bg-[#cfdcc9] text-[#4f644f]"
                      }`}
                  >
                    Diferencia potencial
                  </button>
                </div>
              </div>
            </div>
            {/* Botón de realiar experimento */}
            <div className="absolute right-15 mt-100">
              <button
                onClick={() => navigate("/biolink_ipc/RealizarExperimento")}
                className="bg-[#446957] hover:bg-[#3e5b4d]
                  text-pl_white_a py-3 px-6 rounded-full font-medium"
              >
                Realizar experimento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LineaHumedad({ data }) {
  if (!data || data.length === 0) return null;

  const maxVal = 100;
  const minVal = 0;

  const puntos = data.map((p, idx) => {
    const x = data.length === 1 ? 0 : (idx / (data.length - 1)) * 100;
    const norm = (p.value - minVal) / (maxVal - minVal);
    const y = (1 - norm) * 100;
    return `${x},${y}`;
  });

  return (
    <svg
      className="w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        points={puntos.join(" ")}
        fill="none"
        stroke="#85a27a"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
