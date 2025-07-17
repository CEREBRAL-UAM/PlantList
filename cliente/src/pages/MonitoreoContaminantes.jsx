import React, { useEffect, useState } from "react";
import { getDatosContaminantes } from "../api/monitoreo.api";

export function MonitoreoContaminantes() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosContaminantes()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Monitoreo de Contaminantes</h1>
      {datos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between bg-red-200 dark:bg-red-300 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🌫️  CO</span>
            <span className="text-xl font-bold text-gray-800">{datos[0].CO} ppm</span>
          </div>
          <div className="flex items-center justify-between bg-blue-300 dark:bg-blue-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🌬️ CO₂</span>
            <span className="text-xl font-bold text-gray-800">{datos[0].CO2} ppm</span>
          </div>
          <div className="flex items-center justify-between bg-green-300 dark:bg-green-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🍃 O</span>
            <span className="text-xl font-bold text-gray-800">{datos[0].O} ppm</span>
          </div>
          <div className="flex items-center justify-between bg-purple-300 dark:bg-purple-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🧪 COVs</span>
            <span className="text-xl font-bold text-gray-800">{datos[0].COVs} ppm</span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Cargando datos...</p>
      )}
    </div>
  );
}
