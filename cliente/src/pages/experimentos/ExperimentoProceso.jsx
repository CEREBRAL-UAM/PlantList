import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { InfoPanel } from "../../components/panel/InfoPanel";
import { sensorTiempoReal } from "../../api/sensorTiempoReal";

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
                  onClick={() => setModo("voltaje")}
                  className={`px-8 py-2 rounded-full text-sm font-medium transition
                    ${
                      modo === "voltaje"
                        ? "bg-[#d1d5db] text-gray-900"
                        : "bg-[#e5e5e5] text-gray-700 hover:bg-[#d1d5db]"
                    }`}
                >
                  Voltaje
                </button>

                <button
                  type="button"
                  onClick={() => setModo("amperaje")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition
                    ${
                      modo === "amperaje"
                        ? "bg-[#e11d48] text-white shadow-md"
                        : "bg-[#fecaca] text-[#7f1d1d] hover:bg-[#fda4af]"
                    }`}
                >
                  Amperaje
                </button>
              </div>
            </div>
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
