import { useEffect, useState } from "react";
import { getEspecies } from "../api/especies.api";
import { useForm } from "react-hook-form";
import { crearPlanta } from "../api/plantas.api";
import { useNavigate } from "react-router-dom";

export function FormPlanta() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [especies, setEspecies] = useState([]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("familia", data.familia);
    formData.append("id_especies", parseInt(data.id_especies, 10));
    //formData.append("usuario", 1); // IMPORTNTE: ESTO ES TEMPORAL, CUANDO HAYA USUARIOS LO CAMBIO
    // LA LINEA DE ARRIBA IMPORTANTEE

    if (data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const res = await crearPlanta(formData);
      console.log("Planta creada:", res);
      navigate("/plantlist/plantas");
    } catch (error) {
      console.error("Error al crear planta:", error.response?.data || error);
    }
  });

  useEffect(() => {
    async function cargarEspecies() {
      const res = await getEspecies();
      setEspecies(res.data);
    }
    cargarEspecies();
  }, []);

  return (
    <div>
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
          placeholder="Familia"
          {...register("familia", { required: true })}
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

        <select {...register("id_especies", { required: true })}>
          <option value="">Selecciona una especie</option>
          {especies.map((especie) => (
            <option key={especie.id_especies} value={especie.id_especies}>
              {especie.nombre_cientifico}
            </option>
          ))}
        </select>

        <button>Agregar planta</button>
      </form>
    </div>
  );
}
