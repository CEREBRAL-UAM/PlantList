import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react"; 
import { logoutUsuario } from "../api/usuarios.api";

export function Navigation() {
  const [menuHambOpen, setMenuHambOpen] = useState(false);
  const menuHambLeft = useRef(null);
  const menuHambRight = useRef(null);

  async function cerrarSesion() {
    localStorage.clear();
    await logoutUsuario();
  }
    
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (!menuHambLeft.current || !menuHambLeft.current.contains(event.target)) &&
        (!menuHambRight.current || !menuHambRight.current.contains(event.target))
      ) {
        setMenuHambOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <>
      {/* Header */}
      <header className="bg-[#73AFA5] px-4 py-4 shadow flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/src/images/iconos/logo.png"
            alt="logo"
            className="h-14 ml-2"
          />

          {/* Botón hamburguesa izquierdo */}
          <div className="hidden md:block relative text-pl_white_a mt-5" ref={menuHambLeft}>
            <button
              onClick={() => setMenuHambOpen(!menuHambOpen)}
              className="text-pl_white_a hover:text-pl_green_b dark:text-pl_green_b dark:hover:text-pl_white_a focus:outline-none"
            >
              {menuHambOpen ? <X size={25} /> : <Menu size={25} />}
            </button>

            {menuHambOpen && (
              <div className="absolute top-full right-1/2 translate-x-1/2 bg-pl_green_a mt-2 rounded shadow-lg z-30 text-sm font-baloo text-center">
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
                  to="/biolink_ipc/personalizar"
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
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex ml-auto mr-10 gap-8 font-baloo text-[#F3EEEA] dark:text-[#264313] relative">
          {[
            {
              title: "PLANTAS",
              links: [
                { to: "/biolink_ipc/espacios", label: "MIS ESPACIOS" },
                { to: "/biolink_ipc/especies", label: "ESPECIES" },
                { to: "/biolink_ipc/padecimientos", label: "PADECIMIENTOS" },
              ],
            },
            {
              title: "MONITOREO",
              links: [
                { to: "/biolink_ipc/monitoreo", label: "MONITOREO AMBIENTAL" },
                { to: "/biolink_ipc/monitoreo", label: "MONITOREO DE SUELO" },
                { to: "/biolink_ipc/monitoreo", label: "MONITOREO DE CONTAMINANTES" },
                { to: "/biolink_ipc/monitoreo", label: "VER TODO"},
              ],
            },
            {
              title: "EXPERIMENTOS",
              links: [
                { to: "/biolink_ipc/MonitorearPlanta", label: "MONITOREAR PLANTA" },
                { to: "/biolink_ipc/RealizarExperimento", label: "REALIZAR EXPERIMENTO" },
                { to: "/biolink_ipc/GestionExperimentos", label: "GESTIONAR EXPERIMENTOS" },
                { to: "/biolink_ipc/experimentos", label: "VER TODO" },
              ],
            },
          ].map(({ title, links }, index) => (
            <div key={index} className="relative group">
              <button className="hover:text-pl_green_b focus:outline-none dark:text-pl_green_b dark:hover:text-pl_white_a">
                {title}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-pl_green_a rounded shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-30 text-center">
                {links.map((link, i) => (
                  <Link
                    key={i}
                    to={link.to}
                    className="block px-4 py-2 whitespace-nowrap hover:bg-pl_green_e hover:text-white dark:text-pl_green_b dark:hover:text-pl_white_a"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Botón hamburguesa derecho*/}
        <div className="md:hidden relative z-20 text-pl_white_a" ref={menuHambRight}>
          <button
            onClick={() => setMenuHambOpen(!menuHambOpen)}
            className="text-pl_white_a hover:text-pl_green_b dark:text-pl_green_b dark:hover:text-pl_white_a focus:outline-none"
          >
            {menuHambOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          {menuHambOpen && (
            <div className="absolute top-full right-0 bg-pl_green_a mt-2 rounded shadow-lg z-30 text-sm font-baloo text-center">
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
                to="/biolink_ipc/personalizar"
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
    </>
  );
}