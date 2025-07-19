import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
//import { datosUsuarioActual } from "../api/usuarios.api";
import { Menu, X } from "lucide-react";
import { BannerUsuario } from "../components/layout/BannerUsuario";

export function Monitoreo() {
  // const [usuario, setUsuario] = useState([]);
  // const [plantasOpen, setPlantasOpen] = useState(false);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [menuHambOpen, setMenuHambOpen] = useState(false);
  const plantasRef = useRef(null);
  const menuHamb = useRef(null);

  // async function cargarDatosUsuario() {
  //   const res = await datosUsuarioActual();
  //   setUsuario(res.data);
  // }

  // useEffect(() => {
  //   cargarDatosUsuario();
  // }, []);

  async function cerrarSesion() {
    localStorage.clear();
    await logoutUsuario();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (plantasRef.current && !plantasRef.current.contains(event.target)) {
        setPlantasOpen(false);
      }
      if (menuHamb.current && !menuHamb.current.contains(event.target)) {
        setMenuHambOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#73AFA5] px-4 py-4 shadow flex items-center justify-between md:justify-start md:gap-4 relative">
        {/* Logo */}
        <div className="flex items-center ">
          <img
            src="/src/images/iconos/logo.png"
            alt="logo"
            className="h-14 ml-2"
          />
        </div>

        <div
          className="relative text-pl_white_a mt-5 ml-[-10px]"
          ref={menuHamb}
        >
          <button
            onClick={() => setMenuHambOpen(!menuHambOpen)}
            className="
            text-pl_white_a
            hover:text-pl_green_b 
            focus: outline-none
            dark:text-pl_green_b
            dark:hover:text-pl_white_a
            "
          >
            <Menu size={25} />
          </button>
          {menuHambOpen && (
            <div className="absolute top-full left-0 bg-pl_green_a text-sm mt-2 rounded shadow-lg z-10 font-baloo">
              <Link
                to="/biolink_ipc/#"
                className="
                block px-4 py-2
                hover:bg-pl_green_e
                hover:text-white
                dark:text-pl_green_b
                dark:hover:text-pl_white_a"
                onClick={() => setMenuHambOpen(false)}
              >
                CONTACTO
              </Link>
              <Link
                to="/biolink_ipc/#"
                className="
                block px-4 py-2 
                hover:bg-pl_green_e
                hover:text-white
                dark:text-pl_green_b
                dark:hover:text-pl_white_a"
                onClick={() => setMenuHambOpen(false)}
              >
                PERSONALIZAR
              </Link>
              <Link
                to="/biolink_ipc/home"
                className="
                block px-4 py-2 
                hover:bg-pl_green_e
              hover:text-white
                dark:text-pl_green_b
                dark:hover:text-pl_white_a"
                onClick={() => {
                  setMenuHambOpen(false);
                  cerrarSesion();
                }}
              >
                SALIR
              </Link>
            </div>
          )}
        </div>
      </header>

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
          {/* Monitoreo Ambiental */}
          <Link
            to="/biolink_ipc/monitoreoAmbiental"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/monitorear.png"
              alt="Monitoreo Ambiental"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Monitoreo Ambiental
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Aquí se visualizarán los datos ambientales.
            </p>
          </Link>

          {/* Monitoteo de Suelo */}
          <Link
            to="/biolink_ipc/monitoreoSuelo"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/monitorear.png "
              alt="Monitoreo de Suelo"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Monitoreo de Suelo
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Aquí se visualizarán los datos de suelo.
            </p>
          </Link>

          {/* Monitoreo de Contaminantes */}
          <Link
            to="/biolink_ipc/monitoreoContaminantes"
            className="bg-white dark:bg-[#76916D] rounded-3xl p-4 md:p-6 shadow-md hover:shadow-xl dark:hover:bg-[#6d8864] transition block"
          >
            <img
              src="/src/images/iconos/gestionar.png"
              alt="Monitoreo de Contaminantes"
              className="mx-auto h-20 md:h-24 mb-4"
            />
            <h3 className="text-xl text-[#264313] dark:text-[#F3EEEA] font-baloo">
              Monitoreo de Contaminantes
            </h3>
            <p className="text-sm font-nunito text-[#446957] dark:text-[#F3EEEA] mt-2">
              Aquí se visualizarán los datos de contaminantes.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
