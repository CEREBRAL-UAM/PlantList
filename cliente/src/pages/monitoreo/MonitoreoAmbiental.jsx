import React, { useEffect, useState } from "react";
import { getDatosAmbientales } from "../../api/monitoreo.api"; // ajusta la ruta según tu estructura

export function MonitoreoAmbiental() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosAmbientales()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        Monitoreo Ambiental
      </h1>
      {datos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* TEMP */}
          <div className="flex items-center justify-between bg-yellow-200 dark:bg-yellow-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🌤️</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].TempAmbiental}°C
            </span>
          </div>

          {/* HUMEDAD */}
          <div className="flex items-center justify-between bg-blue-200 dark:bg-blue-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">💧</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].Humedad}%
            </span>
          </div>

          {/* LUX */}
          <div className="flex items-center justify-between bg-green-200 dark:bg-green-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">💡</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].Lux} lx
            </span>
          </div>

          {/* RADIACIÓN */}
          <div className="flex items-center justify-between bg-orange-200 dark:bg-orange-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">☀️</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].Radiacion} W/m²
            </span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Cargando datos...</p>
      )}
    </div>
  );
}
