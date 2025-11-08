import { useLocation, useNavigate } from "react-router-dom";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { InfoPanel } from "../../components/panel/InfoPanel";

export function ExperimentoProceso() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    espacioNombre = "",
    plantaNombre = "",
    plantaId = "",
    tipoEstimulacion = "",
    materialElectrodosNombre = "",
    partePlanta = "",
    distancia = "",
    plagaTipo = "",
  } = state || {};

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="min-h-screen w-full flex items-start py-20 px-15 ">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[20rem,1fr] gap-6">
          {/* Panel de Información */}
          <div className="flex">
            <InfoPanel
              espacioNombre={espacioNombre}
              plantaNombre={plantaNombre}
              plantaId={plantaId}
              tipoEstimulacion={tipoEstimulacion}
              materialElectrodosNombre={materialElectrodosNombre}
              partePlanta={partePlanta}
              distancia={distancia}
              plagaTipo={plagaTipo}
            />
          </div>

          {/* espacio a la derecha reservado */}
          <div className="hidden md:block" />
        </div>
      </div>
    </div>
  );
}