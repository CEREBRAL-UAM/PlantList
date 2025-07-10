import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { logoutUsuario } from "../api/usuarios.api";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [plantasOpen, setPlantasOpen] = useState(false);
  const [menuHambOpen, setMenuHambOpen] = useState(false);
  const plantasRef = useRef(null);
  const menuHamb = useRef(null);

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
    <nav className="bg-pl_green_a p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      {/* Móvil: boton1 y boton2 a la izquierda, hamburguesa a la derecha */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <div className="flex gap-4">
          <Link
            to="/ruta1"
            className="text-pl_white_a font-baloo hover:text-pl_green_b"
          >
            boton1
          </Link>
          <Link
            to="/ruta2"
            className="text-pl_white_a font-baloo hover:text-pl_green_b"
          >
            boton2
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-pl_white_a text-2xl focus:outline-none"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 pb-4 border-b border-pl_green_b">
          <div className="relative" ref={plantasRef}>
            <button
              onClick={() => setPlantasOpen(!plantasOpen)}
              className="text-pl_white_a font-baloo hover:text-pl_green_b focus:outline-none"
            >
              PLANTAS
            </button>
            {plantasOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                <Link
                  to="/biolink_ipc/espacios"
                  className="hover:text-pl_green_b"
                  onClick={() => setMenuOpen(false)}
                >
                  MIS ESPACIOS
                </Link>
                <Link
                  to="/biolink_ipc/especies"
                  className="hover:text-pl_green_b"
                  onClick={() => setMenuOpen(false)}
                >
                  ESPECIES
                </Link>
                <Link
                  to="/biolink_ipc/padecimientos"
                  className="hover:text-pl_green_b"
                  onClick={() => setMenuOpen(false)}
                >
                  PADECIMIENTOS
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/proyectos"
            className="text-pl_white_a font-baloo hover:text-pl_green_b"
            onClick={() => setMenuOpen(false)}
          >
            PROYECTOS
          </Link>
          <Link
            to="/sabermas"
            className="text-pl_white_a font-baloo hover:text-pl_green_b"
            onClick={() => setMenuOpen(false)}
          >
            SABER MÁS
          </Link>
        </div>
      )}

      {/* Versión escritorio */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex gap-6">
          <Link
            to="/ruta1"
            className="
            text-pl_white_a 
            hover:text-pl_green_b 
            font-baloo
            dark:text-pl_green_b
            dark:hover:text-pl_white_a"
          >
            boton1
          </Link>
          <div className="relative text-pl_white_a" ref={menuHamb}>
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
              <Menu />
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
        </div>

        <div className="flex gap-6 items-center text-pl_white_a font-baloo relative">
          <div className="relative" ref={plantasRef}>
            <button
              onClick={() => setPlantasOpen(!plantasOpen)}
              className="
              hover:text-pl_green_b 
              focus:outline-none
              dark:text-pl_green_b
              dark:hover:text-pl_white_a"
            >
              PLANTAS
            </button>
            {plantasOpen && (
              <div className="absolute top-full left-0 bg-pl_green_a text-sm mt-2 rounded shadow-lg z-10">
                <Link
                  to="/biolink_ipc/espacios"
                  className="
                  block px-4 py-2 
                  hover:bg-pl_green_e
                  hover:text-white
                  dark:text-pl_green_b
                  dark:hover:text-pl_white_a"
                  onClick={() => setPlantasOpen(false)}
                >
                  MIS ESPACIOS
                </Link>
                <Link
                  to="/biolink_ipc/especies"
                  className="
                  block px-4 py-2 
                  hover:bg-pl_green_e
                  hover:text-white
                  dark:text-pl_green_b
                  dark:hover:text-pl_white_a"
                  onClick={() => setPlantasOpen(false)}
                >
                  ESPECIES
                </Link>
                <Link
                  to="/biolink_ipc/padecimientos"
                  className="
                  block px-4 py-2 
                  hover:bg-pl_green_e
                  hover:text-white 
                  dark:text-pl_green_b
                  dark:hover:text-pl_white_a"
                  onClick={() => setPlantasOpen(false)}
                >
                  PADECIMIENTOS
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/monitoreo"
            className="
          hover:text-pl_green_b
          dark:text-pl_green_b
          dark:hover:text-pl_white_a"
          >
            MONITOREO
          </Link>
          <Link
            to="/biolink_ipc/experimentos"
            className="
          hover:text-pl_green_b
          dark:text-pl_green_b
          dark:hover:text-pl_white_a"
          >
            EXPERIMENTOS
          </Link>
        </div>
      </div>
    </nav>
  );
}
