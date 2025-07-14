export function Colaborador({ usuario }) {
  const imagenUrl = usuario.Foto
    ? `http://localhost:8000${usuario.Foto}`
    : "http://localhost:8000/media/fotos_perfil_usuarios/default.jpg";
  return (
    <div className="p-5 flex flex-col items-center">
      <img
        src={imagenUrl}
        alt="No imagen disponible"
        className="rounded-full w-12 "
      />
      <div className="p-2 text-black dark:text-pl_white_a">
        <p>
          {usuario.Nombre} {usuario.ApellidoPaterno}
        </p>
      </div>
    </div>
  );
}
