import React, { useEffect, useState } from "react";
import { getDatosContaminantes } from "../../api/monitoreo.api";

export function MonitoreoContaminantes() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosContaminantes()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);

  return (
    <div className="px-6 pt-24 pb-10 min-h-screen transition-colors">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-700 dark:text-green-400 mb-10 drop-shadow-md">
        Monitoreo de Contaminantes
      </h1>

      {datos.length > 0 ? (
        <>
          {/* Información general*/}
          <div className="text-center text-gray-800 dark:text-gray-200 text-lg mb-8 space-y-1">
            <p>
              <strong>📅 Fecha:</strong>{" "}
              {new Date(datos[0].fechaSensado).toLocaleString()}
            </p>
            <p>
              <strong>🆔 ID Circuito:</strong> {datos[0].id_Circuito}
            </p>
            <p>
              <strong>📶 Bluetooth:</strong> {datos[0].id_bluetooth}
            </p>
            <p>
              <strong>📝 Descripción:</strong> {datos[0].descripcion}
            </p>
          </div>

          {/* Tarjetas con estilo original */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between bg-red-200 dark:bg-red-300 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🌫️ CO</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].CO} ppm
              </span>
            </div>
            <div className="flex items-center justify-between bg-blue-300 dark:bg-blue-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🌬️ CO₂</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].CO2} ppm
              </span>
            </div>
            <div className="flex items-center justify-between bg-green-300 dark:bg-green-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🍃 O</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].O} ppm
              </span>
            </div>
            <div className="flex items-center justify-between bg-purple-300 dark:bg-purple-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🧪 COVs</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].COVs} ppm
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 text-xl">
          Cargando datos...
        </p>
      )}
    </div>
  );
}
