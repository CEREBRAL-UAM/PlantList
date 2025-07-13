import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react"; 
import { logoutUsuario } from "../api/usuarios.api";

export function HeaderExperimentos() {
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

    // Links
    const pathname = location.pathname;
    let navLinks = [];
    if (pathname.startsWith("/biolink_ipc/MonitorearPlanta")) {
        navLinks = [
            { to: "/biolink_ipc/RealizarExperimento", label: "REALIZAR EXPERIMENTO" },
            { to: "/biolink_ipc/GestionExperimentos", label: "GESTIONAR EXPERIMENTOS" },
        ]   ;
    } else if (pathname.startsWith("/biolink_ipc/RealizarExperimento")) {
        navLinks = [
            { to: "/biolink_ipc/MonitorearPlanta", label: "MONITOREAR PLANTA" },
            { to: "/biolink_ipc/GestionExperimentos", label: "GESTIONAR EXPERIMENTOS" },
        ];
    } else if (pathname.startsWith("/biolink_ipc/GestionExperimentos")) {
        navLinks = [
            { to: "/biolink_ipc/MonitorearPlanta", label: "MONITOREAR PLANTA" },
            { to: "/biolink_ipc/RealizarExperimento", label: "REALIZAR EXPERIMENTO" },
        ];
    }

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
                            <div className="absolute top-full left-0 bg-pl_green_a mt-2 w-48 rounded shadow-lg z-30 text-sm font-baloo">
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
                <nav className="hidden md:flex ml-auto mr-10 gap-6 font-baloo text-[#F3EEEA] dark:text-[#264313]">
                    {navLinks.map((link) => (
                        <Link
                        key={link.to}
                        to={link.to}
                        className="hover:text-pl_green_b dark:hover:text-pl_white_a transition-colors"
                        >
                        {link.label}
                        </Link>
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
                        <div className="absolute top-full right-0 bg-pl_green_a mt-2 rounded shadow-lg z-30 text-sm font-baloo">
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