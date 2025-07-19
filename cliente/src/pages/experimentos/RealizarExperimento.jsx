import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function RealizarExperimento() {
  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-4xl px-4 mx-auto mt-10">
        <h2 className="text-2xl font-baloo text-center mb-6 text-[#264313] dark:text-[#F3EEEA]">
          Experimento nuevo
        </h2>

        <form className="flex flex-col space-y-6 items-center w-full">
          {/* Grupo Planta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:mb-10 md:gap-x-15 w-full justify-items-center">
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Planta
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>
                  Seleccione la planta
                </option>
                <option>Opción 1</option>
                <option>Opción 2</option>
              </select>
            </div>
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                ID de la planta
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>
                  Seleccione id de planta
                </option>
                <option>Opción 1</option>
              </select>
            </div>
          </div>

          {/* Grupo Experimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-15 w-full justify-items-center">
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Tipo de experimento
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>
                  Seleccione tipo de experimento
                </option>
                <option>Opción 1</option>
              </select>
            </div>
            <div className="w-full max-w-md">
              <label className="block mb-2 font-nunito text-[#264313] dark:text-[#F3EEEA]">
                Material de electrodos
              </label>
              <select className="bg-[#F3EEEA] dark:bg-[#BCC8B2] text-[#85A27A] dark:text-green-900 rounded-2xl py-3 px-5 w-full drop-shadow-xl appearance-none border border-[#446957]">
                <option disabled selected>
                  Seleccione material de electrodos
                </option>
                <option>Opción 1</option>
              </select>
            </div>
          </div>

          {/* Botón */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#446957] hover:bg-[#3e5b4d] text-white py-3 px-8 rounded-full font-medium"
            >
              Iniciar experimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
