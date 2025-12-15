import { useEffect, useRef, useState } from "react";

export function Video({ width = 380, height = 220, pantallaStream }) {
  const videoRef = useRef(null);
  const previewRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const camaraStream = useRef(null);

  const [grabando, setGrabando] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const [tiempo, setTiempo] = useState(0);
  const timerRef = useRef(null);

  // Vista previa de cámara
  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        camaraStream.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error cámara:", err);
      }
    };

    iniciarCamara();
  }, []);
  useEffect(() => {
    if (mostrarPreview && camaraStream.current) {
      camaraStream.current.getTracks().forEach(t => t.stop());
    }
  }, [mostrarPreview]);

  // Cronómetro
  const iniciarTimer = () => {
    timerRef.current = setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
  };
  const detenerTimer = () => clearInterval(timerRef.current);

  // Iniciar grabación
  window.startScreenRecording = (stream) => {
    if (!stream) return;

    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setPreviewURL(URL.createObjectURL(blob));
      setMostrarPreview(true);
      detenerTimer();
    };

    recorder.start();
    iniciarTimer();
    setGrabando(true);
  };

  // Terminar grabación
  const terminarGrabacion = () => {
    mediaRecorderRef.current.stop();
    // Detener pantalla
    pantallaStream.getTracks().forEach(t => t.stop());
    // Detener cámara
    if (camaraStream.current) {
      camaraStream.current.getTracks().forEach(t => t.stop());
    }
    setGrabando(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Vista previa */}
      {mostrarPreview ? (
        <div className="flex flex-col items-center gap-4">
          <video
            ref={previewRef}
            src={previewURL}
            controls
            className="rounded-lg shadow"
            style={{ width, height }}
          />
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-pl_green_c text-pl_white_b hover:bg-[#57804A] rounded-2xl font-nunito text-sm">
              Aceptar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Cámara en vivo */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg object-cover bg-black"
            style={{ width, height }}
          />

          {grabando && (
            <div className="text-red-500 font-nunito text-xl">
              {new Date(tiempo * 1000).toISOString().substr(11, 8)}
            </div>
          )}

          {/* Botón Terminar */}
          {grabando && (
            <button
              onClick={terminarGrabacion}
              className="px-4 py-2 bg-pl_red_a text-pl_white_b hover:bg-[#734C30] rounded-2xl font-nunito text-sm"
            >
              Terminar
            </button>
          )}
        </>
      )}
    </div>
  );
}
