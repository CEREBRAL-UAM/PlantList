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

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
        INICIAR SESION
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electronico"
          {...register("CorreoElectronico", { required: true })}
        />
        <input
          type="text"
          placeholder="Contraseña"
          {...register("Contrasenia", { required: true })}
        />

        <button>Iniciar Sesión</button>
      </form>
    </div>
  );
}
