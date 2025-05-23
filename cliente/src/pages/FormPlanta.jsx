import { useEffect, useState } from "react";
import { getEspacio } from "../api/espacios.api";
import { useForm } from "react-hook-form";
import { crearPlanta } from "../api/plantas.api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function FormPlanta() {
  const { id_espacios } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [espacio, setEspacio] = useState([]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("familia", data.familia);
    formData.append("id_espacios", parseInt(id_espacios, 10));
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
    async function cargarEspacio() {
      if (id_espacios) {
        const res = await getEspacio(id_espacios);
        setEspacio(res.data);
      }
    }
    cargarEspacio();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-center mb-4">AGREGAR PLANTA</h1>
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

        <button>Agregar planta</button>
      </form>
    </div>
  );
}
