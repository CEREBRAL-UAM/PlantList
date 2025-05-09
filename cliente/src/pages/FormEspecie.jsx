import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearEspecie } from "../api/especies.api";

export function FormEspecie() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("origen", data.origen);
    formData.append("descubridor", data.descubridor);

    try {
      const res = await crearEspecie(formData);
      console.log("Especie creada:", res);
      navigate("/plantlist/plantas");
    } catch (error) {
      console.error("Error al crear especie:", error.response?.data || error);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombra la especie"
          {...register("nombre", { required: true })}
        />
        <input
          type="text"
          placeholder="Origen"
          {...register("origen", { required: true })}
        />
        <input
          type="text"
          placeholder="¿Quien la descubrió?"
          {...register("descubridor", { required: true })}
        />
        <textarea
          rows="3"
          placeholder="Descripción"
          {...register("descripcion", { required: true })}
        ></textarea>

        <button>Agregar especie</button>
      </form>
    </div>
  );
}
