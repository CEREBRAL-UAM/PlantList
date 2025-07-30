import React, { useEffect, useState } from "react";
import { getDatosAmbientales } from "../../api/monitoreo.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import DateIcon from "../../images/iconos/Date.png";
import IdIcon from "../../images/iconos/ID.png";
import BluetoothIcon from "../../images/iconos/Bluetooth.png";
import DescriptionIcon from "../../images/iconos/Description.png";

export function MonitoreoAmbiental() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosAmbientales()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-6 pt-6 pb-10 min-h-screen" style={{ fontFamily: "'Baloo Bhai 2', cursive" }}>
          <BannerUsuario />
          <h1 className="text-5xl font-extrabold text-center mb-8 drop-shadow-md"
            style={{ color: "darkgreen", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
            MONITOREO AMBIENTAL
          </h1>

      {datos.length > 0 ? (
        <>
          {/* Información general */}
          <div
            className="max-w-md mx-auto mt-8 p-6 rounded-xl shadow-lg space-y-4 transition-colors"
            style={{ backgroundColor: "rgb(235, 229, 223)" }}
          >
            <div className="flex items-center space-x-3">
              <img
                src={DateIcon}
                alt="Fecha"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>Fecha:</strong>{" "}
                {new Date(datos[0].FechaSensado).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={IdIcon}
                alt="ID Circuito"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>ID Circuito:</strong> {datos[0].id_Circuito}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={BluetoothIcon}
                alt="Bluetooth"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>Bluetooth:</strong> {datos[0].id_bluetooth}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={DescriptionIcon}
                alt="Descripción"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>Descripción:</strong> {datos[0].descripcion}
              </p>
            </div>
          </div>

          {/* Tarjetas de datos ambientales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(177, 203, 168)" }} 
            >
              <span className="text-2xl font-bold">🌤️ Temp</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].TempAmbiental} °C
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(161, 197, 191)" }} 
            >
              <span className="text-2xl font-bold">💧 Humedad</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Humedad} %
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(189, 156, 137)" }} 
            >
              <span className="text-2xl font-bold">💡 Lux</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Lux} lx
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(107, 135, 121)" }} 
            >
              <span className="text-2xl font-bold">☀️ Radiación</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Radiacion} W/m²
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(161, 197, 191)" }} 
            >
              <span className="text-2xl font-bold">🔵 Luz Azul</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Luz_Azul} nm
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(177, 203, 168)" }} 
            >
              <span className="text-2xl font-bold">⚪ Luz Blanca</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].Luz_Blanca} nm
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(107, 135, 121)" }}  
            >
              <span className="text-2xl font-bold">🔴 Luz Roja</span>
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
