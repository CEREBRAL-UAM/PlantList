import React from "react";
import { datosUsuarioActual } from "../api/usuarios.api";
import { useEffect, useState } from "react";
import { BotonAtras } from "../components/botones/BotonAtras";

export function VerUsuario() {
  const [usuario, setUsuario] = useState([]);

  async function cargarDatosUsuario() {
    const res = await datosUsuarioActual();
    setUsuario(res.data);
  }

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const imagenUrl = usuario.foto
    ? `${usuario.foto}`
    : "http://localhost:8000/media/fotos_perfil_usuarios/default.jpg";

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <BotonAtras />
      <h1 className="text-xl font-bold text-left font-nunito text-pl_green_b dark:text-pl_white_a">
        CUENTA
      </h1>
      <div>
        <img
          src={imagenUrl}
          alt="Imagen ni disponible"
          className="rounded-full w-14 h-14"
        />
        <h2>
          {usuario.Nombre} {usuario.ApellidoPaterno}
        </h2>

        <table>
          <td>
            <tr>Nombre (s): {usuario.Nombre}</tr>
            <tr>Apellido Paterno: {usuario.ApellidoPaterno}</tr>
            <tr>Apellido Materno: {usuario.ApellidoMaterno}</tr>
          </td>
          <td>
            <tr>Correo: {usuario.CorreoElectronico}</tr>
            <tr>Usuario: Alumno </tr>
            <tr>Telefono: {usuario.Telefono}</tr>
          </td>
        </table>
      </div>
    </div>
  );
}
