import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearEspacioUsuario } from "../../api/espacios.api";
import { useState } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";

export function FormEspacio() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm();
  const [serverErr, setServerErr] = useState("");
  const fotoFile = watch("foto");

  const onSubmit = handleSubmit(async (data) => {
    setServerErr("");
    const formData = new FormData();
    formData.append("nombre_espacio", data.nombre_espacio);
    formData.append("id_usuario", parseInt(3, 10)); // Usuario de prueba

    if (data.foto && data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      await crearEspacioUsuario(formData);
      reset();
      navigate("/plantlist/espacios");
    } catch (error) {
      setServerErr("Ocurrió un error al crear el espacio.");
    }
  });

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-nunito text-[#2e5d32]">
      {/* Banner de Usuario (Trae el icono y nombre automáticamente) */}
      <BannerUsuario />

      <div className="max-w-4xl mx-auto p-6 md:p-10 flex flex-col items-center">
        
        {/* Título Principal */}
        <h1 className="text-3xl font-extrabold text-[#4a5d23] uppercase tracking-[0.2em] mb-16 text-center">
          AGREGAR ESPACIO
        </h1>

        {/* --- FORMULARIO CENTRADO --- */}
        <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col items-center gap-10">
          
          {serverErr && (
            <div className="w-full text-center rounded-xl bg-red-100 p-3 text-red-700 text-sm font-bold border border-red-200">
              {serverErr}
            </div>
          )}

          {/* TARJETA UNIFICADA (IMAGEN + NOMBRE) */}
          <div className="w-full rounded-[2.5rem] overflow-hidden shadow-lg border-2 border-[#b5c2ad]">
            
            {/* ÁREA DE FOTO / ICONO REFERENCIAL */}
            <label className="block w-full h-64 bg-[#c2ccb9] cursor-pointer relative flex flex-col items-center justify-center hover:bg-[#b8c2af] transition-colors group">
              <input type="file" accept="image/*" {...register("foto")} className="sr-only" />
              
              {fotoFile && fotoFile[0] ? (
                <img 
                  src={URL.createObjectURL(fotoFile[0])} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center flex flex-col items-center gap-4">
                  <img 
                    src="/images/iconos/agregarE.png" 
                    alt="IcoAgregarE" 
                    className="w-24 h-24 object-contain opacity-80"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5d7a5e]">
                    Selecciona una foto del espacio
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white font-bold text-sm uppercase bg-[#4a5d23]/60 px-4 py-2 rounded-full">
                   Cambiar Foto
                 </span>
              </div>
            </label>

            <div className="w-full bg-[#6c8e71] p-5"> 
              <input
                type="text"
                placeholder="Nombre del Espacio"
                {...register("nombre_espacio", { required: "Este campo es obligatorio" })}
                className="w-full bg-transparent text-white placeholder-white/70 outline-none text-center font-bold text-xl focus:border-white transition-colors"
              />
              {errors.nombre_espacio && (
                <p className="text-xs text-red-200 font-extrabold uppercase mt-2 text-center">
                  {errors.nombre_espacio.message}
                </p>
              )}
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-16 py-3 rounded-full text-white font-extrabold tracking-[0.15em] shadow-md transition-all uppercase flex items-center justify-center gap-3 active:scale-95
              ${isSubmitting ? "bg-[#9bbda3] cursor-wait opacity-50" : "bg-[#4a5d23] hover:bg-[#3a4a1c] hover:scale-105"}`}
          >
            {isSubmitting ? "GUARDANDO..." : "GUARDAR"}
          </button>

        </form>
      </div>
    </div>
  );
}