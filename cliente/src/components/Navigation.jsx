import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [plantasOpen, setPlantasOpen] = useState(false);
  const plantasRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (plantasRef.current && !plantasRef.current.contains(event.target)) {
        setPlantasOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-pl_green_a p-4">
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
                  to="/plantlist/espacios"
                  className="hover:text-pl_green_b"
                  onClick={() => setMenuOpen(false)}
                >
                  MIS ESPACIOS
                </Link>
                <Link
                  to="/plantlist/especies"
                  className="hover:text-pl_green_b"
                  onClick={() => setMenuOpen(false)}
                >
                  ESPECIES
                </Link>
                <Link
                  to="/plantlist/padecimientos"
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

      {/* Versión escritorio sin cambios */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex gap-6">
          <Link
            to="/ruta1"
            className="text-pl_white_a hover:text-pl_green_b font-baloo"
          >
            boton1
          </Link>
          <Link
            to="/ruta2"
            className="text-pl_white_a hover:text-pl_green_b font-baloo"
          >
            boton2
          </Link>
        </div>

        <div className="flex gap-6 items-center text-pl_white_a font-baloo relative">
          <div className="relative" ref={plantasRef}>
            <button
              onClick={() => setPlantasOpen(!plantasOpen)}
              className="hover:text-pl_green_b focus:outline-none"
            >
              PLANTAS
            </button>
            {plantasOpen && (
              <div className="absolute top-full left-0 bg-pl_green_a text-sm mt-2 rounded shadow-lg z-10">
                <Link
                  to="/plantlist/espacios"
                  className="block px-4 py-2 hover:bg-pl_white_a hover:text-white"
                  onClick={() => setPlantasOpen(false)}
                >
                  MIS ESPACIOS
                </Link>
                <Link
                  to="/plantlist/especies"
                  className="block px-4 py-2 hover:bg-pl_white_a hover:text-white"
                  onClick={() => setPlantasOpen(false)}
                >
                  ESPECIES
                </Link>
                <Link
                  to="/plantlist/padecimientos"
                  className="block px-4 py-2 hover:bg-pl_white_a hover:text-white"
                  onClick={() => setPlantasOpen(false)}
                >
                  PADECIMIENTOS
                </Link>
              </div>
            )}
          </div>

          <Link to="/proyectos" className="hover:text-pl_green_b">
            PROYECTOS
          </Link>
          <Link to="/sabermas" className="hover:text-pl_green_b">
            SABER MÁS
          </Link>
        </div>
      </div>
    </nav>
  );
}
