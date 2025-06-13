import { registrarUsuario } from "../api/usuarios.api";
import { useForm } from "react-hook-form";

export function RegistrarCuenta() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("Nombre", data.Nombre);
    formData.append("ApellidoPaterno", data.ApellidoPaterno);
    formData.append("ApellidoMaterno", data.ApellidoMaterno);
    formData.append("Telefono", data.Telefono);
    formData.append("CorreoElectronico", data.CorreoElectronico);
    if (data.Contrasenia == data.ConfirmarContrasenia) {
      formData.append("Contrasenia", data.Contrasenia);
      formData.append("ConfirmarContrasenia", data.ConfirmarContrasenia);
    } else {
      console.log("Las contraseñas no coinciden!");
      return;
    }

    try {
      const respuesta = await registrarUsuario(formData);
      console.log("Usuario creado !");
    } catch (error) {
      console.error("Error al crear usuario:", error.response?.data || error);
    }
  });

  return (
    <div className="pt-20 sm:pt-20 md:pt-16 lg:pt-16">
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
        REGISTRAR USUARIO
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          {...register("Nombre", { required: true })}
        />
        <input
          type="text"
          placeholder="Apellido paterno"
          {...register("ApellidoPaterno", { required: true })}
        />
        <input
          type="text"
          placeholder="Apellido materno"
          {...register("ApellidoMaterno", { required: true })}
        />
        <input
          type="number"
          placeholder="Numero telefonico"
          {...register("Telefono", { required: true })}
        />
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
        <input
          type="text"
          placeholder="Confirmar contrasenia"
          {...register("ConfirmarContrasenia", { required: true })}
        />
        <button>Crear cuenta</button>
      </form>
    </div>
  );
}
