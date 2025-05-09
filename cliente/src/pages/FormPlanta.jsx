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
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("especie", parseInt(data.especie, 10));
    formData.append("usuario", 1); // IMPORTNTE: ESTO ES TEMPORAL, CUANDO HAYA USUARIOS LO CAMBIO
    // LA LINEA DE ARRIBA IMPORTANTEE

    if (data.imagen[0]) {
      formData.append("imagen", data.imagen[0]);
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
          placeholder="Nombra tu planta"
          {...register("nombre", { required: true })}
        />
        <textarea
          rows="3"
          placeholder="Descripción"
          {...register("descripcion", { required: true })}
        ></textarea>

        <input
          type="file"
          accept="image/png, image/jpeg"
          {...register("imagen", { required: false })}
        />

        <select {...register("especie", { required: true })}>
          <option value="">Selecciona una especie</option>
          {especies.map((especie) => (
            <option key={especie.id} value={especie.id}>
              {especie.nombre}
            </option>
          ))}
        </select>

        <button>Agregar planta</button>
      </form>
    </div>
  );
}
