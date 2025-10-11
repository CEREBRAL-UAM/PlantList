// src/pages/experimentos/RutasProtegidas.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { datosUsuarioActual } from "../../api/usuarios.api";

export function RutasProtegidas() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("NO_TOKEN");

        // Usa caché si existe
        const cached = localStorage.getItem("isAdmin");
        if (cached === "true" || cached === "false") {
          if (alive) {
            setAllowed(cached === "true");
            setChecking(false);
          }
          return;
        }

        // Si no hay caché, consulta /actual/
        const { data } = await datosUsuarioActual(); // { ..., isAdmin: true/false }
        const admin = !!data?.isAdmin;
        localStorage.setItem("isAdmin", String(admin));
        if (alive) {
          setAllowed(admin);
          setChecking(false);
        }
      } catch {
        localStorage.removeItem("isAdmin");
        if (alive) {
          setAllowed(false);
          setChecking(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Mientras valida, no renderiza nada (pantalla limpia)
  if (checking) return <div />;

  // Si no tiene permiso, se queda en la URL actual.
  if (!allowed) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Sin permiso</h3>
        <p>No tienes acceso a esta sección.</p>
      </div>
    );
  }

  return <Outlet />;
}
