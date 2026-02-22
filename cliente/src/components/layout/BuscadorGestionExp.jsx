import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export function BuscadorGestionExp({ onChange, value }) {
  const frases = ["20/10/2025", "Patio", "Plagas/Tocar", "00:00"];

  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [escribiendo, setEscribiendo] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const actual = frases[pIndex];
    const VEL_ESCRITURA = 50;
    const VEL_BORRADO = 35;
    const PAUSA_FIN = 900;
    const PAUSA_VACIO = 400;

    let t;
    if (escribiendo) {
      if (cIndex < actual.length) {
        t = setTimeout(() => {
          setPlaceholder(actual.slice(0, cIndex + 1));
          setCIndex((prev) => prev + 1);
        }, VEL_ESCRITURA);
      } else {
        t = setTimeout(() => setEscribiendo(false), PAUSA_FIN);
      }
    } else {
      if (cIndex > 0) {
        t = setTimeout(() => {
          setPlaceholder(actual.slice(0, cIndex - 1));
          setCIndex((prev) => prev - 1);
        }, VEL_BORRADO);
      } else {
        t = setTimeout(() => {
          setEscribiendo(true);
          setPIndex((prev) => (prev + 1) % frases.length);
        }, PAUSA_VACIO);
      }
    }
    return () => clearTimeout(t);
  }, [escribiendo, cIndex, pIndex]);

  const manejadorCambios = (e) => {
    const texto = e.target.value;

    let fecha = "";
    let hora = "";

    // fecha completa
    let m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (m) {
      const [, d, mo, y] = m;
      fecha = `${y}-${mo}-${d}`;
    }

    // hora completa
    m = /^(\d{2}):(\d{2})$/.exec(texto);
    if (m) {
      hora = texto;
    }

    onChange(texto, fecha, hora);
  };

  return (
    <div className="flex w-full justify-end items-center mt-6">
      <div className="bg-pl_gray_input rounded-2xl shadow-lg w-[20%] flex pl-3 p-1.5 items-center dark:bg-pl_gray_dark_input">
        <Search className="ml-1 mr-3 w-6 h-6" />
        <input
          type="text"
          value={value}
          onChange={manejadorCambios}
          placeholder={placeholder}
          className="w-full focus:outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
