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

        // 1) Cache
        const cachedTipo = localStorage.getItem("TipoUsuario");
        if (cachedTipo) {
          const ok = cachedTipo === "isAdmin" || cachedTipo === "isParticipant";
          if (alive) { setAllowed(ok); setChecking(false); }
          return;
        }

        // 2) API
        const { data } = await datosUsuarioActual(); // { TipoUsuario }
        const tipo = data?.TipoUsuario || "";
        localStorage.setItem("TipoUsuario", tipo);

        const ok = tipo === "isAdmin" || tipo === "isParticipant";
        if (alive) { setAllowed(ok); setChecking(false); }
      } catch {
        localStorage.removeItem("TipoUsuario");
        if (alive) { setAllowed(false); setChecking(false); }
      }
    })();

    return () => { alive = false; };
  }, []);

  if (checking) return <div />;
  if (!allowed) {
    return (
      <div style={{ textAlign: "center", marginTop: 40, color: "#777", fontFamily: "sans-serif" }}>
        <h3>Sin permiso</h3>
        <p>No tienes acceso a esta sección.</p>
      </div>
    );
  }
  return <Outlet />;
}
