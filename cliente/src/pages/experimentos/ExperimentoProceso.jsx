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
    humTierra: humedadActual !== null ? `${humedadActual}` : "—",
    tempAmb: "0",
    humAmb: "0",
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
      // Subir video
      const fd = new FormData();
      fd.append("archivo", blob, "exp.webm");
      fd.append("Nombre", "Experimento");

      const resVideo = await createVideo(fd); // debe ser multipart
      const idVideo = resVideo.data.id_Video;

      // Guardar experimento
      const payload = {
        id_TipoEstimulacion: state.id_TipoEstimulacion,
        id_PartePlanta: state.id_PartePlanta,
        Fecha_Sensado: new Date().toLocaleDateString("en-CA"),
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

      <h1 className="text-center text-xl font-bold font-nunito text-pl_green_b dark:text-pl_white_a mb-6 mt-10">
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

            {/* Botones */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 mb-5">
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
                    {seleccionados.potencial && <LineaHumedad data={datosHumedad} />}
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
