import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { InfoPanel } from "../../components/panel/InfoPanel";
import { sensorTiempoReal } from "../../api/sensorTiempoReal";
import { Video } from "../../components/visuales/Video";
import { GrabarPantalla } from "../../pages/experimentos/GrabarPantalla"

// Ticks para el eje Y y la cuadrícula
const TICKS_Y = [0, 20, 40, 60, 80, 100];

export function ExperimentoProceso() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    espacioNombre = "",
    plantaNombre = "",
    plantaId = "",
    tipoEstimulacion = "",
    circuitoBluetooth = "",
    circuitoLabel = "",
    materialElectrodosNombre = "",
    partePlanta = "",
    distancia = "",
    plagaTipo = "",
  } = state || {};

  const [modo, setModo] = useState("amperaje");

  // Datos en tiempo real desde el servicio Python
  const datosHumedad = sensorTiempoReal();
  const humedadActual =
    datosHumedad.length > 0
      ? datosHumedad[datosHumedad.length - 1].value
      : null;

  const sensores = [
    { id: "tempAmb", label: "Temp Amb" },
    { id: "tempHum", label: "Temp Hum" },
    { id: "ph", label: "PH" },
    { id: "humTierra", label: "Hum Tierra" },
  ];

  const pantallaStream = GrabarPantalla.pantallaStream;
  useEffect(() => {
    if (pantallaStream && window.startScreenRecording) {
      window.startScreenRecording(pantallaStream);
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="min-h-screen w-full flex items-start py-20 px-6 lg:px-16">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-10">
          {/* Panel de Información */}
          <div className="md:col-span-1 flex">
            <InfoPanel
              espacioNombre={espacioNombre}
              plantaNombre={plantaNombre}
              plantaId={plantaId}
              tipoEstimulacion={tipoEstimulacion}
              circuitoBluetooth={circuitoBluetooth}
              circuitoLabel={circuitoLabel}
              materialElectrodosNombre={materialElectrodosNombre}
              partePlanta={partePlanta}
              distancia={distancia}
              plagaTipo={plagaTipo}
            />
          </div>

          {/* Gráfica y controles */}
          <div className="md:col-span-2 w-full flex flex-col md:ml-20">
            {/* Chips de sensores */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 sm:mb-6 lg:mb-8">
              {sensores.map((s) => (
                <div
                  key={s.id}
                  className="
                    px-5 py-2 rounded-xl
                    bg-[#cccccc] text-gray-800
                    text-sm md:text-base font-nunito
                    shadow-sm select-none
                  "
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* Contenedor gráfica y botones */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-4 mt-6 sm:mt-0">
              {/* Área de gráfica con eje Y a la izquierda */}
              <div className="flex-1 flex flex-col min-h-[260px] sm:min-h-[auto]">
                <div className="relative flex-1 pt-4 pb-6 sm:pt-2 sm:pb-5">
                  {/* Eje Y y cuadrícula en las mismas filas */}
                  <div className="absolute inset-0 flex flex-col-reverse justify-between">
                    {TICKS_Y.map((v, idx) => (
                      <div key={v} className="flex items-center">
                        {/* Etiqueta del eje Y */}
                        <span className="w-10 text-[0.7rem] text-gray-500 text-right mr-2">
                          {v}
                        </span>
                        {/* Línea horizontal */}
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

                  {/* Área donde dibuja el SVG (desplazada a la derecha de las etiquetas) */}
                  <div className="absolute inset-y-0 right-0 left-12">
                    <LineaHumedad data={datosHumedad} />
                  </div>
                </div>

                {/* Pie de gráfica */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Humedad actual:{" "}
                    {humedadActual !== null ? `${humedadActual}%` : "—"}
                  </span>
                </div>
              </div>

              {/* Botones Voltaje / Amperaje */}
              <div className="w-full md:w-40 flex md:flex-col gap-3 justify-start md:justify-center items-center">
                <button
                  type="button"
                  onClick={() => setModo("iluminacion")}
                  className={`w-35 h-10 rounded-full text-sm font-nunito transition
                    ${
                      modo === "iluminacion"
                        ? "bg-pl_green_b text-pl_white_b"
                        : "bg-[#93a189] text-[#243824] hover:bg-[#6f8a63]"
                    }`}
                >
                  Iluminación
                </button>

                <button
                  type="button"
                  onClick={() => setModo("solar")}
                  className={`w-35 h-10 rounded-full text-sm font-nunito transition
                    ${
                      modo === "solar"
                        ? "bg-pl_green_a text-pl_white_b"
                        : "bg-[#cfe5e2] text-[#3f6f6a] hover:bg-[#b9d8d3]"
                    }`}
                >
                  Radiación solar
                </button>

                <button
                  type="button"
                  onClick={() => setModo("potencial")}
                  className={`w-40 h-10 rounded-full text-sm font-nunito transition
                    ${
                      modo === "potencial"
                        ? "bg-pl_green_c text-pl_white_b"
                        : "bg-[#cfdcc9] text-[#4f644f] hover:bg-[#b8ccb0]"
                    }`}
                >
                  Diferencia potencial
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Video */}
          <div className="md:col-span-2 md:col-start-2 w-full flex justify-center mt-10">
              <Video 
                width={600}
                height={350}
                pantallaStream={pantallaStream}
               />
          </div>
        </div>
      </div>
    </div>
  );
}

function LineaHumedad({ data }) {
  if (!data || data.length === 0) return null;

  // Rango del sensor
  const maxVal = 100;
  const minVal = 0;

  const puntos = data.map((p, idx) => {
    const x = data.length === 1 ? 0 : (idx / (data.length - 1)) * 100; // 0 a 100 en X
    const norm = (p.value - minVal) / (maxVal - minVal);
    const y = (1 - norm) * 100; // 0 arriba, 100 abajo
    return `${x},${y}`;
  });

  const pointsAttr = puntos.join(" ");

  return (
    <svg
      className="w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        points={pointsAttr}
        fill="none"
        stroke="#85a27a"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
