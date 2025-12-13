import { loginUsuario } from "../../api/usuarios.api";
import { datosUsuarioActual } from "../../api/usuarios.api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { PantallaCarga } from "../common/PantallaCarga";

export function IniciarSesion() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append("CorreoElectronico", data.CorreoElectronico);
    formData.append("Contrasenia", data.Contrasenia);

    try {
      const respuesta = await loginUsuario(formData);
      const token = respuesta.data.token;
      localStorage.setItem("token", token);

      const usuario = await datosUsuarioActual();
      localStorage.setItem("nombre", usuario.data.Nombre);
      localStorage.setItem("apellidoP", usuario.data.ApellidoPaterno);
      localStorage.setItem("foto", usuario.data.Foto);

      setCargando(true);
      setTimeout(() => {
        navigate("/biolink_ipc/espacios");
      }, 1500);
    } catch (error) {
      console.error("Error al acceder:", error.response?.data || error);
    }
  });

  if (cargando) {
    return <PantallaCarga />;
  }

  return (
    <div className="min-h-screen w-full bg-no-repeat bg-center bg-cover bg-[url(/images/fondos/iniciarSesion.png)] lg:bg-[length:100%_100%] relative">
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/50 scale-z-100" />

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-[#F3EEEA] px-4">
        {/* Flecha */}
        <button className="absolute top-10 left-5 lg:top-15 lg:left-15 z-30">
          <img
            src="/images/iconos/flecha.png"
            alt="flecha"
            className="w-[30px] lg:w-[45px] transition duration-300 hover:scale-120"
          />
        </button>

        {/* Logo y título*/}
        <div className="lg:absolute lg:top-20 lg:left-40 static flex flex-col lg:flex-row items-center font-baloo">
          <img
            src="/images/iconos/logo.png"
            alt="logo"
            className="h-[15vw] lg:h-[90px] block"
          />
          <h1 className="lg:ml-2 mt-1 lg:mt-0">
            <span className="text-[10vw] sm:text-[90px]">BioLink</span>{" "}
            <span className="text-xl sm:text-3xl">IPC</span>
          </h1>
        </div>

        {/* Contenedor de formulario */}
        <div className="w-full max-w-sm p-14 lg:p-9 lg:mt-20 lg:ml-180">
          <h2 className="text-2xl lg:text-3xl font-baloo text-center mb-6">
            Iniciar sesión
          </h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Correo */}
            <input
              type="email"
              id="CorreoElectronico"
              placeholder="correo electrónico"
              {...register("CorreoElectronico", { required: true })}
              className="w-full text-black text-center lg:text-left lg:px-8 py-2 bg-[#F3EEEA] border border-[#E5E5E5] rounded-full focus:outline-none focus:border-[#73AFA5] focus:border-3 placeholder-[#787878] mb-4 lg:mb-6"
            />

            {/* Contraseña */}
            <input
              type="password"
              id="Contrasenia"
              placeholder="contraseña"
              {...register("Contrasenia", { required: true })}
              className="w-full text-black text-center lg:text-left lg:px-8 py-2 bg-[#F3EEEA] border border-[#E5E5E5] rounded-full focus:outline-none focus:border-[#73AFA5] focus:border-3 placeholder-[#787878] mb-4 lg:mb-6"
            />

            {/* Botón Ingresar */}
            <button
              type="submit"
              className="w-36 py-2 bg-[#73AFA5] text-white font-nunito rounded-full hover:bg-[#618B84] transition duration-200 mx-auto"
            >
              Ingresar
            </button>

            {/* Links */}
            <div className="text-center space-y-4 ">
              <a
                href="#"
                className="block hover:text-[#73AFA5] transition-colors duration-300"
              >
                Crear una cuenta
              </a>
              <a
                href="#"
                className="block text-sm hover:text-[#73AFA5] transition-colors duration-300"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
