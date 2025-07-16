import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
//import { datosUsuarioActual } from "../api/usuarios.api";
import { Menu, X } from "lucide-react";
import { SecHeader } from "../components/SecHeader";

export function Experimentos() {
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
      <SecHeader />

      {/* Opciones */}
      <section className="text-center py-8 md:py-10 px-4 flex-grow">
        <h2 className="text-2xl font-baloo text-[#264313] dark:text-[#F3EEEA] mb-6 md:mb-10">
          ¿Qué deseas hacer hoy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 md:gap-6">
          {/* Monitorear planta */}
          <Link
            to="/biolink_ipx/MonitorearPlanta"
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
