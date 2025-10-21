import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { logoutUsuario, datosUsuarioActual } from "../../api/usuarios.api";
import { useEffect, useState } from "react";

export function HeaderEscritorio() {
  const [acceso, setAcceso] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAcceso(false);
      localStorage.removeItem("TipoUsuario");
      return;
    }

    let alive = true;
    (async () => {
      try {
        const { data } = await datosUsuarioActual(); // { TipoUsuario?: 'isAdmin'|'isParticipant' }
        const tipo = data?.TipoUsuario;
        const access = tipo === 'isAdmin' || tipo === 'isParticipant';

        localStorage.setItem("TipoUsuario", tipo || "");
        if (alive) setAcceso(access);
      } catch(e) {
        if (alive) setAcceso(false);
        localStorage.removeItem("TipoUsuario");
      }
    })();

    return () => { alive = false; };
  }, []);

  async function cerrarSesion() {
    try {
      await logoutUsuario();
    } catch (e) {
      console.warn("Logout falló (continuamos limpiando):", e);
    } finally {
      localStorage.clear();
      // Redirección segura sin useNavigate
      window.location.assign("/biolink_ipc/login");
    }
  }

  const menu = [
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
      to: "/biolink_ipc/monitoreo",
      links: [
        {
          to: "/biolink_ipc/monitoreoAmbiental",
          label: "MONITOREO AMBIENTAL",
        },
        {
          to: "/biolink_ipc/monitoreoSuelo",
          label: "MONITOREO DE SUELO",
        },
        {
          to: "/biolink_ipc/monitoreoContaminantes",
          label: "MONITOREO DE CONTAMINANTES",
        },
      ],
    },
    // 🔹 Solo admins ven este bloque
    ...(acceso
      ? [
          {
            title: "EXPERIMENTOS",
            to: "/biolink_ipc/experimentos",
            links: [
              {
                to: "/biolink_ipc/MonitorearPlanta",
                label: "MONITOREAR PLANTA",
              },
              {
                to: "/biolink_ipc/RealizarExperimento",
                label: "REALIZAR EXPERIMENTO",
              },
              {
                to: "/biolink_ipc/GestionExperimentos",
                label: "GESTIONAR EXPERIMENTOS",
              },
            ],
          },
        ]
      : []),
    {
      title: "APLICACIONES",
      to: "/biolink_ipc/aplicaciones",
      links: [],
    },
  ];

  return (
    <header
      className="
        hidden sm:flex 
        bg-pl_green_a pt-2 pb-2 
        shadow items-center 
        justify-between relative"
    >
      {/* Header */}
      <div className="justify-center flex items-center gap-2">
        <img
          src="/src/images/iconos/logo.png"
          alt="logo modo claro"
          className="h-14 ml-2 block dark:hidden pl-4"
        />

        <img
          src="/src/images/iconos/logo_oscuro.png"
          alt="logo modo oscuro"
          className="h-14 ml-2 hidden dark:block pl-4"
        />

        {/* Botón hamburguesa izquierdo */}
        <div className=" relative text-pl_white_a group">
          <div
            className="
              text-pl_white_a 
              hover:text-pl_green_b 
              dark:text-pl_green_b 
              dark:hover:text-pl_white_a 
              mt-2"
          >
            <Menu size={25} />
          </div>

          <div
            className="
              absolute top-full 
              right-1/2 translate-x-1/2 
              bg-pl_green_a mt-2 rounded 
              shadow-lg z-30 text-sm font-baloo 
              text-center opacity-0 
              group-hover:opacity-100 
              invisible group-hover:visible 
              transition-all duration-200 
              min-w-max max-w-full"
          >
            <Link
              to="/biolink_ipc/#"
              className="
                block px-3 py-2
                hover:bg-pl_green_e
                hover:text-white
                dark:text-pl_green_b
                dark:hover:text-pl_white_a"
            >
              CONTACTO
            </Link>
            <Link
              to="/biolink_ipc/personalizar"
              className="
                block px-3 py-2
                hover:bg-pl_green_e
                hover:text-white 
                dark:text-pl_green_b 
                dark:hover:text-pl_white_a"
            >
              PERSONALIZAR
            </Link>
            <Link
              to="/biolink_ipc/login"
              onClick={cerrarSesion}
              className="
                block px-3 py-2
                hover:bg-pl_green_e
                hover:text-white
                dark:text-pl_green_b
                dark:hover:text-pl_white_a"
            >
              SALIR
            </Link>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav
        className="
          pt-2.5
          hidden sm:flex ml-auto 
          mr-10 gap-8 font-baloo 
          text-pl_white_a 
          dark:text-pl_green_b relative"
      >
        {menu.map(({ title, links, to }, index) => (
          <div key={index} className="relative group">
            {to ? (
              <Link
                to={to}
                className="
                    hover:text-pl_green_b 
                    focus:outline-none 
                    dark:text-pl_green_b 
                    dark:hover:text-pl_white_a
                  "
              >
                {title}
              </Link>
            ) : (
              <span
                className="
                  cursor-default 
                  hover:text-pl_green_b 
                  dark:text-pl_green_b 
                  dark:hover:text-pl_white_a"
              >
                {title}
              </span>
            )}
            <div
              className="
                absolute left-1/2 -translate-x-1/2 
                top-full mt-2 bg-pl_green_a rounded 
                shadow-lg opacity-0 group-hover:opacity-100 
                invisible group-hover:visible transition-all 
                duration-200 z-30 text-center"
            >
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="
                    block px-3 py-2
                    hover:bg-pl_green_e
                    hover:text-white 
                    dark:text-pl_green_b 
                    dark:hover:text-pl_white_a
                    text-sm whitespace-nowrap
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </header>
  );
}
