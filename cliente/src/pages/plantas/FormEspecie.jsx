import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearEspecie } from "../../api/especies.api";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function FormEspecie() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [serverErr, setServerErr] = useState("");
  const fotoFile = watch("foto");

  const onSubmit = handleSubmit(async (data) => {
    setServerErr("");

    const formData = new FormData();
    formData.append("nombre_cientifico", data.nombre_cientifico);
    formData.append("alias", data.alias);
    formData.append("descripcion", data.descripcion);
    formData.append("origen", data.origen);

    if (data.foto && data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const res = await crearEspecie(formData);
      console.log("Especie creada:", res);

      reset();
      navigate("/plantlist/especies");
    } catch (error) {
      console.error("Error al crear especie:", error.response?.data || error);
      setServerErr("Ocurrió un error al crear la especie.");
    }
  });

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-nunito text-[#2f4f28]">
      <BannerUsuario />

      <main className="w-full px-6 py-10">
        <h1 className="text-[26px] font-extrabold text-center text-[#2f4f28] uppercase tracking-wide mb-12">
          AGREGAR ESPECIE
        </h1>

        <form
          onSubmit={onSubmit}
          className="max-w-[980px] mx-auto flex flex-col items-center gap-10"
        >
          {serverErr && (
            <div className="w-full max-w-[850px] text-center rounded-xl bg-red-100 p-3 text-red-700 text-sm font-bold border border-red-200">
              {serverErr}
            </div>
          )}

          <section className="w-full flex flex-col lg:flex-row justify-center items-center gap-14">
            <div className="w-[225px] h-[265px] bg-[#bdcdb2] rounded-[1.4rem] shadow-lg overflow-hidden flex flex-col">
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
                    alt="Preview especie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/iconos/agregarE.png"
                    alt="Agregar especie"
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
                  {...register("alias", { required: "Este campo es obligatorio" })}
                  className="w-full bg-transparent text-center text-white placeholder-white/80 text-[21px] font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-[330px]">
              <input
                type="text"
                placeholder="Nombre científico"
                {...register("nombre_cientifico", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />

              <input
                type="text"
                placeholder="Familia"
                {...register("familia")}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />

              <input
                type="text"
                placeholder="Origen"
                {...register("origen", { required: "Este campo es obligatorio" })}
                className="w-full h-[54px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-8 rounded-2xl shadow-md outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
              />

            </div>
          </section>

          <textarea
            rows="6"
            placeholder="Descripción..."
            {...register("descripcion", {
              required: "Este campo es obligatorio",
            })}
            className="w-full max-w-[850px] min-h-[200px] bg-[#bdcdb2] text-[#637d57] placeholder-[#637d57] px-10 py-10 rounded-2xl shadow-md resize-none outline-none text-[19px] font-semibold focus:ring-2 focus:ring-[#78966e]"
          />

          {(errors.nombre_cientifico ||
            errors.alias ||
            errors.origen ||
            errors.descripcion) && (
            <p className="text-sm text-red-700 font-bold">
              Revisa los campos obligatorios.
            </p>
          )}

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