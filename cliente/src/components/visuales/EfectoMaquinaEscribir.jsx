import { useState, useEffect } from "react";

export function EfectoMaquinaEscribir({
  text = "Biolink",
  speed = 150,
  pause = 1000,
}) {
  const [actualText, setActualText] = useState("");
  const [indexText, setIndexText] = useState(0);
  const [escribiendo, setEscribiendo] = useState(true);
  const [mostrarCursor, setMostrarCursor] = useState(true);

  // Escritura y borrado
  useEffect(() => {
    let timeout;

    if (escribiendo) {
      if (indexText < text.length) {
        timeout = setTimeout(() => {
          setActualText((prev) => prev + text[indexText]);
          setIndexText((prev) => prev + 1);
        }, speed);
      } else {
        // Pausar al terminar de escribir
        timeout = setTimeout(() => {
          setEscribiendo(false);
        }, pause);
      }
    } else {
      if (indexText > 0) {
        timeout = setTimeout(() => {
          setActualText((prev) => prev.slice(0, -1));
          setIndexText((prev) => prev - 1);
        }, speed);
      } else {
        // Pausar al terminar de borrar
        timeout = setTimeout(() => {
          setEscribiendo(true);
        }, pause);
      }
    }

    return () => clearTimeout(timeout);
  }, [indexText, escribiendo, text, speed, pause]);

  // Cursor parpadeante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setMostrarCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span
      className="
        font-nunito
        text-pl_green_b
        text-4xl
    "
    >
      {actualText}
      <span style={{ opacity: mostrarCursor ? 1 : 0 }}>|</span>
    </span>
  );
}
