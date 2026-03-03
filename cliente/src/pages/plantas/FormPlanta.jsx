import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getEspacio } from "../../api/espacios.api";
import { asignarPlantaAEspacio, crearPlanta } from "../../api/plantas.api";

export function FormPlanta() {
  const { id_espacios } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { cantidad: 1 } // Valor por defecto para el nuevo campo
  });
  const [espacio, setEspacio] = useState([]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("familia", data.familia);
    
    if (data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      // 1. Crear la planta
      const res = await crearPlanta(formData);
      const nuevaPlantaId = res.data.id_planta; 

      // 2. VINCULACIÓN CON CANTIDAD DINÁMICA
      await asignarPlantaAEspacio({
        id_Planta: nuevaPlantaId,
        id_espacio: parseInt(id_espacios),
        cantidad: parseInt(data.cantidad), // <--- Valor capturado del formulario
      });

      console.log("¡Vinculación exitosa!");
      navigate(`/biolink_ipc/verEspacio/${id_espacios}`);
      
    } catch (error) {
      console.error("Error en el proceso:", error.response?.data || error);
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
  }, [id_espacios]);

  return (
    <div className=" lg:pt-2">
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
          type="number"
          min="1"
          placeholder="Cantidad de individuos"
          {...register("cantidad", { required: true, min: 1 })}
        />

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