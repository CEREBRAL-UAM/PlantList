import { useEffect, useState } from "react";
import { getEspaciosUsuario } from "../../api/espacios.api";
import { getPlantasPorEspacio } from "../../api/plantas.api";
import { getPlantaIndividuo } from "../../api/experimentos.api";

export function PlantInfoPanel({
  espacios,
  espacioId,
  setEspacioId,
  plantas,
  plantaInd,
  plantaSeleccionadaId,
  setPlantaSeleccionadaId,
  plantaId,
  setPlantaId,
  plantaSeleccionada
}) {

  const suelo = plantaSeleccionada?.id_suelo;
  const etapa = plantaSeleccionada?.id_etapa;
  const origen = plantaSeleccionada?.id_OrigenCrianza;
  const plaga = plantaSeleccionada?.plagas_id_Plaga;

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

      {/* Sección de espacio */}
      <div className="relative mt-6 rounded-2xl border border-pl_green_b p-4 mb-5">
        <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="font-nunito text-pl_green_b dark:text-pl_white_a">
            Espacio
          </span>
        </div>
        
        {/* Fila espacio */}
        <Row
          label="Espacio"
          value={
            <select
              className="bg-pl_green_input dark:bg-[#A3AE9A]
                         text-pl_green_b/80 font-nunito rounded-xl
                         py-1 px-2 ml-2"
              value={espacioId}
              onChange={(e) => setEspacioId(e.target.value)}
            >
              <option value="" disabled>
                Espacio
              </option>
              {espacios.map((e) => (
                <option key={e.id_espacios} value={e.id_espacios}>
                  {e.nombre || e.nombre_espacio}
                </option>
              ))}
            </select>
          }
        />
      </div>

      {/* Sección Planta */}
      <div className="relative mt-6 rounded-2xl border border-pl_green_b p-4 mb-7">
        <div className="absolute -top-3 left-4 bg-pl_white_b px-2">
          <span className="font-nunito text-pl_green_b dark:text-pl_white_a">
            Planta
          </span>
        </div>

        {/* Fila Planta */}
        <Row
          label="Planta"
          value={
            <select
              className="bg-pl_green_input dark:bg-[#A3AE9A] 
                         text-pl_green_b/80 font-nunito rounded-xl 
                         py-1 px-2 ml-2"
              value={plantaSeleccionadaId}
              onChange={(e) => setPlantaSeleccionadaId(e.target.value)}
            >
              <option value="" disabled>
                Planta
              </option>
              {plantas.map((p) => (
                <option key={p.id_planta} value={p.id_planta}>
                  {p.nombre_cientifico}
                </option>
              ))}
            </select>
          }
        />

        {/* Fila ID Planta */}
        <Row
          label="ID Planta"
          value={
            <select
              className="bg-pl_green_input dark:bg-[#A3AE9A] 
                         text-pl_green_b/80 font-nunito rounded-xl 
                         py-1 px-2 ml-2"
              value={plantaId}
              onChange={(e) => setPlantaId(e.target.value)}
            >
              <option value="" disabled>
                ID
              </option>
              {plantaInd.map((pi) => (
                <option key={pi.id_PlantaIndividuo} value={pi.id_PlantaIndividuo}>
                  {pi.id_PlantaIndividuo}
                </option>
              ))}
            </select>
          }
        />

        {plantaId && plantaSeleccionada && (
          <>
            {/* Suelo */}
            <Row
              label="Suelo"
              value={suelo?.nombre_cientifico || "—"}
            />

            {/* Etapa */}
            <Row
              label="Etapa"
              value={etapa?.nombre_cientifico || "—"}
            />

            {/* Origen */}
            <Row
              label="Origen"
              value={origen?.nombre || "—"}
            />

            {/* Plaga */}
            <Row
              label="Plaga"
              value={plaga?.alias || plaga?.nombre_cientifico || "—"}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center gap-2 py-1 text-sm text-pl_green_b dark:text-pl_white_a">
      <span className="font-nunito font-semibold">
        {label}:
      </span>
      <span className="font-nunito">
        {value}
      </span>
    </div>
  );
}
