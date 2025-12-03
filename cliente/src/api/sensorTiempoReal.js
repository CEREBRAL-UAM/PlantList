import { useEffect, useState } from "react";

export function sensorTiempoReal() {
  const [data, setData] = useState([]); 

  useEffect(() => {
    let isMounted = true;

    const fetchDato = async () => {
      try {
        const resp = await fetch("http://localhost:8001/sensor");
        const json = await resp.json();

        if (!isMounted) return;

        if (json.value !== null && json.value !== undefined) {
          setData((prev) => [
            ...prev.slice(-199), // Mantener solo los últimos 200 puntos
            { ts: json.ts, value: json.value },
          ]);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al obtener humedad:", err);
        }
      }
    };

    // Primera lectura
    fetchDato();
    // luego cada 2 segundos (igual que el Arduino)
    const id = setInterval(fetchDato, 2000);

    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  return data;
}
