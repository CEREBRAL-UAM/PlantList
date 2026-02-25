import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { InfoPanel } from "../../components/panel/InfoPanel";
import { sensorTiempoReal } from "../../api/sensorTiempoReal";
import { Video } from "../../components/visuales/Video";
import { GrabarPantalla } from "../../pages/experimentos/GrabarPantalla";
import { createVideo, createExperimento } from "../../api/experimentos.api";
import { ExperimentoGuardado } from "../../components/modal/ExperimentoGuardado";

// Ticks para el eje Y y la cuadrícula
const TICKS_Y = [0, 20, 40, 60, 80, 100];

export function ExperimentoProceso() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    espacioNombre = "",
    plantaNombre = "",
    id_PlantaIndividuo = "",
    tipoEstimulacion = "",
    circuitoBluetooth = "",
    circuitoLabel = "",
    materialElectrodosNombre = "",
    partePlanta = "",
    plagaTipo = "",
  } = state || {};

  const [modo, setModo] = useState("amperaje");

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
    humTierra: humedadActual !== null ? `${humedadActual}` : "—",
    tempAmb: "0",
    tempHum: "0",
    ph: "0",
  };

  const pantallaStream = GrabarPantalla.pantallaStream;
  useEffect(() => {
    if (pantallaStream && window.startScreenRecording) {
      setHoraInicio(new Date());
      window.startScreenRecording(pantallaStream);
    }
  }, []);

  const [horaInicio, setHoraInicio] = useState(() => new Date().toISOString());
  const [horaFin, setHoraFin] = useState(null);

  const onTerminar = () => setHoraFin(new Date().toISOString());

  const [modalVisible, setModalVisible] = useState(false);

  const onAceptar = async (blob) => {
    try {
      // 1) Subir video
      const fd = new FormData();
      fd.append("archivo", blob, "exp.webm");
      fd.append("Nombre", "Experimento");

      const resVideo = await createVideo(fd); // debe ser multipart
      const idVideo = resVideo.data.id_Video;

      // 2) Guardar experimento
      const payload = {
        id_TipoEstimulacion: state.id_TipoEstimulacion,
        id_PartePlanta: state.id_PartePlanta,
        Fecha_Sensado: new Date().toISOString().slice(0, 10),
        Hora_inicio: horaInicio,
        Hora_fin: horaFin || new Date().toISOString(),
        id_PlantaIndividuo: state.id_PlantaIndividuo,
        id_Electrodos: state.id_Electrodos,
        bluetooth: state.bluetooth,
        id_Video: idVideo,
        id_espacios: state.id_espacios,
        id_plaga: state.id_plaga,
      };
      console.log("PAYLOAD EXPERIMENTO:", payload);

      await createExperimento(payload);

      setModalVisible(true);
    } catch (e) {
      console.error("ERROR COMPLETO:", e.response?.data);
      alert(JSON.stringify(e.response?.data));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <h1 className="text-center text-2xl font-bold font-nunito text-pl_green_b dark:text-pl_white_a mb-6 mt-10">
        EXPERIMENTO EN PROCESO
      </h1>

      <div className="min-h-screen w-full flex items-start py-6 px-6 lg:px-16">

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-10">

          {/* Panel de Información */}
          <div className="md:col-span-1">
            <InfoPanel
              espacioNombre={espacioNombre}
              plantaNombre={plantaNombre}
              plantaId={id_PlantaIndividuo}
              tipoEstimulacion={tipoEstimulacion}
              circuitoBluetooth={circuitoBluetooth}
              circuitoLabel={circuitoLabel}
              materialElectrodosNombre={materialElectrodosNombre}
              partePlanta={partePlanta}
              plagaTipo={plagaTipo}
            />
          </div>

          {/* Área principal */}
          <div className="md:col-span-2 w-full flex flex-col">

            {/* Chips de sensores */}
            <div className="flex flex-wrap justify-center gap-4">
              {sensores.map((s) => (
                <div
                  key={s.id}
                  className="px-5 py-2 rounded-xl bg-[#cccccc] text-gray-800 text-sm font-nunito shadow-sm
                   flex flex-col items-center"
                >
                  <span>{s.label}</span>

                  <span className="text-xs text-gray-600 mt-1">
                    {valoresSensores[s.id] ?? "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 mb-5">
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

            {/* Gráfica y video */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

              {/* Gráfica */}
              <div className="flex-1 flex flex-col min-h-[320px] p-4">
                <div className="relative flex-1 pt-4 pb-6">
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

              {/* Video */}
              <div className="flex-1 flex justify-center items-center min-h-[320px]">
                <Video
                  width={400}
                  height={250}
                  pantallaStream={pantallaStream}
                  onTerminar={onTerminar}
                  onAceptar={onAceptar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExperimentoGuardado
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          navigate("/biolink_ipc/GestionExperimentos");
        }}
        />
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
