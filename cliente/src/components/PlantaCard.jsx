export function PlantaCard({ planta }) {
  const imagenUrl = planta.imagen
    ? `${planta.imagen}`
    : "http://localhost:8000/media/plantas/default.jpg";

  //console.log("Imagen URL:", imagenUrl);  -> Verifica la URL

  return (
    <div>
      <img
        src={imagenUrl}
        alt="No imagen disponivle"
        className="w-full h-60 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold text-center mt-2">{planta.nombre}</h2>
      <p className="text-gray-600 text-justify mt-2">{planta.descripcion}</p>
    </div>
  );
}
