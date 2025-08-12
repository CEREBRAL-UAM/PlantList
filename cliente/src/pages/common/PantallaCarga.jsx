import { EfectoMaquinaEscribir } from "../../components/visuales/EfectoMaquinaEscribir";

export function PantallaCarga() {
  const textToType = "Biolink ";

  return (
    <div
      className="
        bg-pl_green_c w-full 
        h-screen items-center 
        flex justify-center
        "
    >
      <EfectoMaquinaEscribir text={textToType} speed={200} />
    </div>
  );
}
