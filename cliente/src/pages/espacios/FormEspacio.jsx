import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearEspacioUsuario } from "../../api/espacios.api";

export function FormEspacio() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre_espacio", data.nombre_espacio);
    formData.append("id_usuario", parseInt(3, 10)); // usuario de prueba

    if (data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const res = await crearEspacioUsuario(formData);
      console.log("Espacio creado:", res);
      navigate("/plantlist/espacios");
    } catch (error) {
      console.error("Error al crear espacio:", error.response?.data || error);
    }
  });

  return (
    <div className="lg:pt-2">
      <h1 className="text-xl font-bold text-center mt-2 font-nunito text-pl_green_b">
        AGREGAR ESPACIO
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombra tu espacio"
          {...register("nombre_espacio", { required: true })}
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          {...register("foto", { required: false })}
        />

        <button>Agregar espacio</button>
      </form>
    </div>
  );
}
