import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function Experimentos() {
  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      {/* Bienvenida */}
      {/* <section className="text-[#264313] dark:text-[#F3EEEA] px-4 md:px-6 py-8 md:py-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-baloo">
           Bienvenid@ {usuario ? `${usuario.Nombre} ${usuario.ApellidoPaterno} ${usuario.ApellidoMaterno}` : "..."}
          </h1>
          <p className="mt-1 text-[#446957] dark:text-[#F3EEEA] font-nunito">¿Estás list@ para comenzar?</p>
        </div>
      </section> */}
      <BannerUsuario />

      {/* Opciones */}
      <section className="text-center py-8 md:py-10 px-4 flex-grow">
        <h2 className="text-2xl font-baloo text-[#264313] dark:text-[#F3EEEA] mb-6 md:mb-10">
          ¿Qué deseas hacer hoy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 md:gap-6">
          {/* Monitorear planta */}
          <Link
            to="/biolink_ipc/MonitorearPlanta"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/monitorear.png"
              alt="Monitorear planta"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Monitorear planta
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Observa la reacción eléctrica de cualquier planta, sin ingresar o
              recolectar datos.
            </p>
          </Link>

          {/* Realizar experimento */}
          <Link
            to="/biolink_ipc/RealizarExperimento"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/monitorear.png "
              alt="Realizar experimento"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Realizar experimento
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Recolecta los datos del momento cuando te aproximas o tocas una
              planta.
            </p>
          </Link>

          {/* Gestionar experimentos */}
          <Link
            to="/biolink_ipc/GestionExperimentos"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/gestionar.png"
              alt="Gestionar experimentos"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Gestionar experimentos
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Elimina, observa o envía los experimentos que tienes almacenados
              de manera local.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
