import { Link } from "react-router";

export function HeaderMovil() {
  return (
    <header
      className="
        block sm:hidden
        bg-pl_green_a 
        shadow
        z-50 fixed 
        bottom-0 left-0 right-0
      "
    >
      <div className="flex w-full">
        <Link
          to="/biolink_ipc/ruta1"
          className="flex-1 flex justify-center items-center hover:bg-pl_green_e pt-4 pb-4"
        >
          <img
            src="/images/iconos/logo_oscuro.png"
            alt="icono"
            className="h-15"
          />
        </Link>
        <Link
          to="/biolink_ipc/ruta2"
          className="flex-1 flex justify-center items-center hover:bg-pl_green_e"
        >
          <img src="/images/iconos/logo.png" alt="icono" className="h-15" />
        </Link>
        <Link
          to="/biolink_ipc/ruta3"
          className="flex-1 flex justify-center items-center hover:bg-pl_green_e"
        >
          <img
            src="/images/iconos/icono_lapiz.png"
            alt="icono"
            className="h-15"
          />
        </Link>
        <Link
          to="/biolink_ipc/ruta4"
          className="flex-1 flex justify-center items-center hover:bg-pl_green_e"
        >
          <img
            src="/images/iconos/logo_oscuro.png"
            alt="icono"
            className="h-15"
          />
        </Link>
      </div>
    </header>
  );
}
