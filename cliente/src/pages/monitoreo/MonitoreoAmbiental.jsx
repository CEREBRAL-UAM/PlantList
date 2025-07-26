import React, { useEffect, useState } from "react";
import { getDatosAmbientales } from "../../api/monitoreo.api";

export function MonitoreoAmbiental() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosAmbientales()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-6 pt-24 pb-10 min-h-screen transition-colors">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-700 dark:text-green-400 mb-10 drop-shadow-md">
        Monitoreo Ambiental
      </h1>

      {datos.length > 0 ? (
        <>
          {/* Información general*/}
          <div className="text-center text-gray-800 dark:text-gray-200 text-lg mb-8 space-y-1">
            <p>
              <strong>📅 Fecha:</strong>{" "}
              {new Date(datos[0].FechaSensado).toLocaleString()}
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

          {/* Tarjetas de datos ambientales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between bg-yellow-200 dark:bg-yellow-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🌤️ Temp</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].TempAmbiental} °C
              </span>
            </div>
            <div className="flex items-center justify-between bg-blue-200 dark:bg-blue-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">💧 Humedad</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Humedad} %
              </span>
            </div>
            <div className="flex items-center justify-between bg-green-200 dark:bg-green-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">💡 Lux</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Lux} lx
              </span>
            </div>
            <div className="flex items-center justify-between bg-orange-200 dark:bg-orange-400 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">☀️ Radiación</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Radiacion} W/m²
              </span>
            </div>
            <div className="flex items-center justify-between bg-sky-200 dark:bg-sky-300 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🔵 Luz Azul</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Luz_Azul} nm
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-400 dark:bg-gray-500 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">⚪ Luz Blanca</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Luz_Blanca} nm
              </span>
            </div>
            <div className="flex items-center justify-between bg-red-200 dark:bg-red-300 rounded-full px-6 py-4 shadow">
              <span className="text-3xl">🔴 Luz Roja</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Luz_Roja} nm
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
