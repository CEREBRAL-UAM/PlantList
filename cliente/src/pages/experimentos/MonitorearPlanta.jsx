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

  // Mostrar seleccionados
  const [seleccionados, setSeleccionados] = useState({
    iluminacion: true,
    solar: true,
    potencial: true,
  });

  // Alternación de selección
  const alternarSeleccion = (key) => {
    setSeleccionados((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Datos en tiempo real
  const datosHumedad = sensorTiempoReal();
  const humedadActual =
    datosHumedad.length > 0
      ? datosHumedad[datosHumedad.length - 1].value
      : null;

  // Sensores
  const sensores = [
    {
      id: "tempAmb",
      label: "Temp Amb",
      color: "rgb(175, 170, 190)",
      icon: "/images/iconos/Temp.png",
    },
    {
      id: "humAmb",
      label: "Hum Amb",
      color: "rgb(140, 180, 200)",
      icon: "/images/iconos/temHumedad.png"
    },
    {
      id: "ph",
      label: "PH",
      color: "rgb(189, 156, 137)",
      icon: "/images/iconos/pH.png",
    },
    {
      id: "humTierra",
      label: "Hum Tierra",
      color: "rgb(220, 175, 185)",
      icon: "/images/iconos/Humedad.png",
    },
  ];

  // Botones de gráfica
  const botonesGrafica = [
    {
      id: "iluminacion",
      label: "Iluminación",
      icon: "/images/iconos/Lux.png",
      color: "rgb(225, 210, 175)",
    },
    {
      id: "solar",
      label: "Radiación solar",
      icon: "/images/iconos/Radiacion.png",
      color: "rgb(189, 156, 137)",
    },
    {
      id: "potencial",
      label: "Diferencia potencial",
      icon: "/images/iconos/difPotencial.png",
      color: "rgb(177, 203, 168)", 
    },
  ];

  const valoresSensores = {
    tempAmb: "0",
    humAmb: "0",
    ph: "0",
    humTierra: humedadActual !== null ? humedadActual : "—",
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
        <h1 className="text-center text-xl font-bold font-nunito text-pl_green_b dark:text-pl_white_a mb-6">
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
              <div className="flex flex-wrap justify-center gap-4 mb-5">
                {sensores.map((s) => (
                  <div
                    key={s.id}
                    className="w-42 h-10 flex items-center justify-between rounded-full px-4 shadow"
                    style={{ backgroundColor: s.color }}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <img
                        src={s.icon}
                        alt={s.label}
                        className="w-6 h-6"
                      />
                      {s.label}
                    </span>

                    <span className="text-sm font-bold text-white">
                      {valoresSensores[s.id] ?? "—"} {s.unidad}
                    </span>
                  </div>
                ))}
              </div>

              {/* Gráfica y botones */}
              <div className="min-h-[320px] flex flex-col md:flex-row gap-8 mt-2">

                {/* Gráfica */}
                <div className="flex-1 flex flex-col min-h-[320px] p-4">
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
                      {seleccionados.potencial && <LineaHumedad data={datosHumedad} />}
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="w-full md:w-40 flex md:flex-col gap-3 justify-start md:justify-center items-center">
                    {botonesGrafica.map((b) => {
                      const activo = seleccionados[b.id];

                      return (
                        <div
                          key={b.id}
                          onClick={() => alternarSeleccion(b.id)}
                          className="w-42 h-10 flex items-center justify-between rounded-full px-4 shadow cursor-pointer transition"
                          style={{
                            backgroundColor: activo ? b.color : "#d4d4d4",
                          }}
                        >
                          <span
                            className="flex items-center gap-2 text-sm font-semibold"
                            style={{ color: activo ? "#ffffff" : "#243824" }}
                          >
                            <img src={b.icon} alt={b.label} className="w-6 h-6" />
                            {b.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            {/* Botón de realiar experimento */}
            <div className="absolute right-15 mt-95">
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
