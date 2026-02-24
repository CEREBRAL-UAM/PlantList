import { useState, useEffect, useRef } from "react";

export function Video({ width = 380, height = 220, pantallaStream, onTerminar, onAceptar }) {

  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const camaraStream = useRef(null);

  const [grabando, setGrabando] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [blobVideo, setBlobVideo] = useState(null);

  const [tiempo, setTiempo] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        camaraStream.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

      } catch (err) {
        console.error("Error cámara:", err);
      }
    };

    iniciarCamara();
  }, []);

  const iniciarTimer = () => {
    timerRef.current = setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
  };

  const detenerTimer = () => clearInterval(timerRef.current);

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
      setBlobVideo(blob);
      setPreviewURL(URL.createObjectURL(blob));
      setMostrarPreview(true);
      detenerTimer();
      if (onTerminar) onTerminar();
    };

    recorder.start();
    iniciarTimer();
    setGrabando(true);
  };

  const terminarGrabacion = () => {
    mediaRecorderRef.current.stop();
    pantallaStream.getTracks().forEach(t => t.stop());
    if (camaraStream.current) {
      camaraStream.current.getTracks().forEach(t => t.stop());
    }
    setGrabando(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">

      {mostrarPreview ? (
        <div className="flex flex-col items-center gap-4">
          <video
            ref={previewRef}
            src={previewURL}
            controls
            className="rounded-lg shadow"
            style={{ width, height }}
          />
          <button
            className="px-4 py-2 bg-pl_green_c text-pl_white_b rounded-2xl"
            onClick={() => onAceptar?.(blobVideo)}
          >
            Aceptar
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg object-cover bg-black"
            style={{ width, height }}
          />

          {grabando && (
            <button
              onClick={terminarGrabacion}
              className="px-4 py-2 bg-pl_red_a text-pl_white_b rounded-2xl"
            >
              Terminar
            </button>
          )}
        </>
      )}
    </div>
  );
}
