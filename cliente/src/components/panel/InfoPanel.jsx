export function InfoPanel({
  espacioNombre = "",
  plantaNombre = "",
  plantaId = "",
  tipoEstimulacion = "",
  materialElectrodosNombre = "",
  partePlanta = "",
  distancia = "",
  plagaTipo = "",
}) {
  
  return (
    <div 
      className="
      absolute w-full md:w-80
      rounded-3xl border border-pl_green_b
      p-4 shadow-xl"
    >
      <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="text-xl font-baloo text-pl_green_b dark:text-pl_white_a">
              Información
          </span>
      </div>
      
      {/* Sección Planta */}
      <div className="relative mt-6 rounded-2xl border border-pl_green_b p-4 mb-7">
        <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="font-nunito text-pl_green_b dark:text-pl_white_a">
            Planta
          </span>
        </div>
        <Row label="Espacio" value={espacioNombre || "—"} />
        <Row label="Planta" value={plantaNombre || "—"} />
        <Row label="Id Planta" value={plantaId || "—"} />
      </div>

      {/* Sección Experimento */}
      <div className="relative rounded-2xl border border-pl_green_b p-4">
        <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="font-nunito text-pl_green_b dark:text-pl_white_a">
            Experimento
          </span>
        </div>
        <Row label="Tipo de estimulación" value={tipoEstimulacion || "—"} />

        {tipoEstimulacion !== "Plagas" && tipoEstimulacion !== "Proximidad" && (
            <Row label="Parte de la planta" value={partePlanta || "—"} />
        )}

        
          
        {tipoEstimulacion === "Proximidad" && (
          <Row label="Distancia (m)" value={distancia !== "" ? String(distancia) : "—"} />
        )}

        {tipoEstimulacion === "Plagas" && (
          <Row label="Tipo de plaga" value={plagaTipo || "—"} />
        )}
      
        <Row label="Material de electrodos" value={materialElectrodosNombre || "—"} />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <p className="text-sm py-1 text-pl_green_b dark:text-pl_white_a">
      <span className="font-nunito">{label}:</span> {value}
    </p>
  );
}