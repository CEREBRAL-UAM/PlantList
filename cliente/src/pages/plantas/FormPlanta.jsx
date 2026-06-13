import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getEspacio } from "../../api/espacios.api";
import { asignarPlantaAEspacio, crearPlanta } from "../../api/plantas.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function FormPlanta() {
  const { id_espacios } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { cantidad: 1 },
  });

  const [espacio, setEspacio] = useState([]);
  const fotoFile = watch("foto");

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("familia", data.familia);

    if (data.foto && data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const res = await crearPlanta(formData);
      const nuevaPlantaId = res.data.id_planta;

      await asignarPlantaAEspacio({
        id_Planta: nuevaPlantaId,
        id_espacio: parseInt(id_espacios),
        cantidad: parseInt(data.cantidad),
      });

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
    <div className="min-h-screen bg-[#f4f1ea] font-nunito text-[#2f4f28]">
      <BannerUsuario />

      <main className="w-full px-6 py-10">
        <h1 className="text-[26px] font-extrabold text-center text-[#2f4f28] uppercase tracking-wide mb-16">
          AGREGAR PLANTA
        </h1>

        <form
          onSubmit={onSubmit}
          className="max-w-[980px] mx-auto flex flex-col items-center gap-16"
        >
          <section className="w-full flex flex-col lg:flex-row justify-center items-center gap-14">
            
            <div className="w-[225px] h-[265px] bg-[#bdcdb2] rounded-t-[2.2rem] shadow-lg overflow-hidden flex flex-col">
              <label className="flex-1 bg-[#bdcdb2] cursor-pointer relative flex items-center justify-center hover:bg-[#b8c2af] transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  {...register("foto")}
                  className="sr-only"
                />

                {fotoFile && fotoFile[0] ? (
                  <img
                    src={URL.createObjectURL(fotoFile[0])}
                    alt="Preview planta"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/iconos/agregarE.png"
                    alt="Agregar planta"
                    className="w-24 h-24 object-contain opacity-80"
                  />
                )}

                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm uppercase bg-[#4a5d23]/60 px-4 py-2 rounded-full">
                    Cambiar foto
                  </span>
                </div>
              </label>

              <div className="h-[62px] bg-[#78966e] flex items-center justify-center px-4">
                <input
                  type="text"
                  placeholder="Alias"
                  {...register("alias", { required: true })}
                  className="w-full bg-transparent text-center text-white placeholder-white/80 text-[21px] font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-[330px]">
              <input
                type="text"
                placeholder="Nombre científico"
                {...register("nombre_cientifico", { required: true })}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />

              <input
                type="text"
                placeholder="Familia"
                {...register("familia", { required: true })}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />

              <input
                type="number"
                min="1"
                placeholder="Cantidad de individuos"
                {...register("cantidad", { required: true, min: 1 })}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />
            </div>
          </section>

          <textarea
            rows="6"
            placeholder="Descripción..."
            {...register("descripcion", { required: true })}
            className="w-full max-w-[850px] min-h-[200px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-10 py-10 rounded-2xl shadow-md resize-none outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-3 rounded-full text-white font-semibold shadow-md transition ${
              isSubmitting
                ? "bg-[#9bbda3] cursor-wait opacity-60"
                : "bg-[#3f6f5a] hover:bg-[#315846]"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </main>
    </div>
  );
}