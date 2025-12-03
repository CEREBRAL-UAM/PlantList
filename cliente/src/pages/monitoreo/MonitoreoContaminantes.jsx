import React, { useEffect, useState } from "react";
import { getDatosContaminantes } from "../../api/monitoreo.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import DateIcon from "../../images/iconos/Date.png";
import IdIcon from "../../images/iconos/ID.png";
import BluetoothIcon from "../../images/iconos/Bluetooth.png";
import DescriptionIcon from "../../images/iconos/Description.png";

export function MonitoreoContaminantes() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    getDatosContaminantes()
      .then((res) => setDatos(res.data))
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);

  return (
    <div
      className="px-6 pt-6 pb-10 min-h-screen"
      style={{ fontFamily: "'Baloo Bhai 2', cursive" }}
    >
      <BannerUsuario />
      <h1 className="text-xl font-bold text-center font-nunito text-pl_green_b dark:text-pl_white_a">
        MONITOREO DE CONTAMINANTES
      </h1>

      {datos.length > 0 ? (
        <>
          {/* Información general */}
          <div
            className="
                max-w-md mx-auto mt-8 
                p-6 rounded-xl shadow-lg 
                space-y-4 transition-colors
                bg-pl_gray_input 
                dark:bg-pl_gray_dark_input
              "
          >
            <div className="flex items-center space-x-3">
              <img src={DateIcon} alt="Icono de fecha" className="w-6 h-6" />
              <p className="text-gray-800 dark:text-white">
                <strong>Fecha:</strong>{" "}
                {new Date(datos[0].fechaSensado).toLocaleString()}
              </p>
            </div>
            {/* <div className="flex items-center space-x-3">
              <img
                src={IdIcon}
                alt="Icono de ID Circuito"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>ID Circuito:</strong> {datos[0].id_Circuito}
              </p>
            </div> */}
            <div className="flex items-center space-x-3">
              <img
                src={BluetoothIcon}
                alt="Icono de Bluetooth"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>Bluetooth:</strong> {datos[0].bluetooth}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={DescriptionIcon}
                alt="Icono de descripción"
                className="w-6 h-6"
              />
              <p className="text-gray-800 dark:text-white">
                <strong>Descripción:</strong> {datos[0].descripcion}
              </p>
            </div>
          </div>

          {/* Tarjetas de contaminantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(177, 203, 168)" }}
            >
              <span className="text-2xl">🌫️ CO</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].CO} ppm
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(161, 197, 191)" }}
            >
              <span className="text-2xl">🌬️ CO₂</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].CO2} ppm
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(189, 156, 137)" }}
            >
              <span className="text-2xl">🍃 O</span>
              <span className="text-xl font-bold text-gray-800">
                {datos[0].O} ppm
              </span>
            </div>

            <div
              className="flex items-center justify-between rounded-full px-6 py-4 shadow"
              style={{ backgroundColor: "rgb(107, 135, 121)" }}
            >
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
