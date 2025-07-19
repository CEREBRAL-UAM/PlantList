import React, { useEffect, useState } from "react";
import { getDatosSuelo } from "../../api/monitoreo.api";

export function MonitoreoSuelo() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosSuelo()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        Monitoreo de Suelo
      </h1>

      {datos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-300 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">⚡</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].Voltaje} V
            </span>
          </div>
          <div className="flex items-center justify-between bg-blue-200 dark:bg-blue-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🔌</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].Amperaje} A
            </span>
          </div>
          <div className="flex items-center justify-between bg-green-200 dark:bg-green-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">🧪</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].PhSuelo}
            </span>
          </div>
          <div className="flex items-center justify-between	bg-cyan-200 dark:bg-cyan-400 rounded-full px-6 py-3 shadow">
            <span className="text-3xl">💧</span>
            <span className="text-xl font-bold text-gray-800">
              {datos[0].HumedadSuelo} %
            </span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Cargando datos...</p>
      )}
    </div>
  );
}
