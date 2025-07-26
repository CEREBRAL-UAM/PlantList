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
    <div className="px-6 pt-24 pb-10 min-h-screen transition-colors">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-700 dark:text-green-400 mb-10 drop-shadow-md">
        Monitoreo de Suelo
      </h1>

      {datos.length > 0 ? (
        <>
          {/* Información general */}
          <div className="text-center text-gray-800 dark:text-gray-200 text-lg mb-8 space-y-1">
            <p>
              <strong>📅 Fecha:</strong>{" "}
              {new Date(datos[0].fechaSensado).toLocaleString()}
            </p>
            <p>
              <strong>🆔 ID Circuito:</strong> {datos[0].id_Circuito}
            </p>
            <p>
              <strong>🪴 ID Planta Individuo:</strong>{" "}
              {datos[0].id_PlantaIndividuo ?? "No asignado"}
            </p>
            <p>
              <strong>🌱 Suelo:</strong> {datos[0].nombre_suelo} —{" "}
              {datos[0].descripcion_suelo}
            </p>
          </div>

          {/* Tarjetas de datos de suelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-300 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">⚡ Voltaje</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Voltaje} V
              </span>
            </div>
            <div className="flex items-center justify-between bg-blue-200 dark:bg-blue-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🔌 Amperaje</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Amperaje} A
              </span>
            </div>
            <div className="flex items-center justify-between bg-green-200 dark:bg-green-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🧪 pH</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].PhSuelo}
              </span>
            </div>
            <div className="flex items-center justify-between bg-cyan-200 dark:bg-cyan-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">💧 Humedad</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].HumedadSuelo} %
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
