import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearEspecie } from "../../api/especies.api";

export function FormEspecie() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("origen", data.origen);

    if (data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const res = await crearEspecie(formData);
      console.log("Especie creada:", res);
      navigate("/plantlist/especies"); //aqui era plantlist, solo es test
    } catch (error) {
      console.error("Error al crear especie:", error.response?.data || error);
    }
  });

  return (
    <div className=" lg:pt-2">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre cientifico"
          {...register("nombre_cientifico", { required: true })}
        />
        <input
          type="text"
          placeholder="Alias"
          {...register("alias", { required: true })}
        />
        <input
          type="text"
          placeholder="Origen"
          {...register("origen", { required: true })}
        />
        <textarea
          rows="3"
          placeholder="Descripción"
          {...register("descripcion", { required: true })}
        ></textarea>

        <input
          type="file"
          accept="image/png, image/jpeg"
          {...register("foto", { required: false })}
        />

        <button>Agregar especie</button>
      </form>
    </div>
  );
}
