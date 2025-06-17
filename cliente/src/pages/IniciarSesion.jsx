import { loginUsuario } from "../api/usuarios.api";
import { useForm } from "react-hook-form";

export function IniciarSesion() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append("CorreoElectronico", data.CorreoElectronico);
    formData.append("Contrasenia", data.Contrasenia);

    try {
      const respuesta = await loginUsuario(formData);
      const token = respuesta.data.token;
      localStorage.setItem("token", token);
      console.log("Usuario autenticado", token);
    } catch (error) {
      console.error("Error al acceder:", error.response?.data || error);
    }
  });

  // return (
  //   <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
  //     <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
  //       INICIAR SESION
  //     </h1>
  //     <form onSubmit={onSubmit} className="flex flex-col gap-4">
  //       <input
  //         type="email"
  //         placeholder="Correo electronico"
  //         {...register("CorreoElectronico", { required: true })}
  //       />
  //       <input
  //         type="text"
  //         placeholder="Contraseña"
  //         {...register("Contrasenia", { required: true })}
  //       />

  //       <button>Iniciar Sesión</button>
  //     </form>
  //   </div>
  // );

  return (
    <div className="bg-[url(/iniciarSesion.png)] bg-[length:100%_100%] bg-center bg-no-repeat">

      <div className="min-h-screen bg-cover flex items-center justify-end pr-[250px]">

        {/* Formulario */}
        <div className="p-9  w-full max-w-sm">

          {/* Texto Inicio de sesión  */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h1>
            
          <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* Input Correo electrónico */}
            <div>
              <input
                type="email"
                id="CorreoElectronico"
                placeholder="correo electrónico"
                {...register("CorreoElectronico", { required: true })}
                className="w-full px-5 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300 mb-6"
              />
            </div>

            {/* Input Contraseña */}
            <div>
              <input
                type="password"
                id="Contrasenia"
                placeholder="contraseña"
                {...register("Contrasenia", { required: true })}
                className="w-full px-5 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-300 mb-6"
              />
            </div>

            {/*Botón Ingresar*/}
            <button
              type="submit"
              className="w-35 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200 mx-auto"
            >
              Ingresar
            </button>

            {/*Botón Crear cuenta*/}
            <div className="text-center">
              <a
                href="#"
                className="text-gray-800 no-underline hover:text-blue-700 transition-colors duration-300"
              >
                Crear una cuenta
              </a>
            </div>

            {/*Botón Olvidaste contraseña*/}
            <div className="text-sm text-center">
              <a
                href="#"
                className="text-gray-800 no-underline hover:text-blue-700 transition-colors duration-300"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

          </form>

          {/* <div className="mt-6 text-center text-gray-500 text-sm">BioLinkIPC</div> */}
        </div>
      </div>
    </div>
  );
}
