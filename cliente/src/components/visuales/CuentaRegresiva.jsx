import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function CuentaRegresiva() {
  const [contador, setContador] = useState(5);
  const navigate = useNavigate();
  const { state } = useLocation(); // Viene desde ConfirmarGrabacion
  const radius = 90;

  useEffect(() => {
    if (contador > 0) {
      const timer = setTimeout(() => setContador((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (contador === 0) {
      // Reenviamos el mismo state hacia ExperimentoProceso
      navigate("/biolink_ipc/ExperimentoProceso", { state });
    }
  }, [contador, navigate, state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Círculo con gradiente giratorio */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#grad-rot)"
            strokeWidth="14"
            fill="transparent"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="grad-rot" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="5s"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="var(--color-pl_white_a)" />
              <stop offset="100%" stopColor="var(--color-pl_green_a)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Número al centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl font-nunito text-pl_green_a">{contador}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 text-pl_white_a bg-pl_red_a opacity-30
                   hover:opacity-100 dark:opacity-100
                   dark:hover:brightness-125 px-6 py-3 rounded-xl"
      >
        Cancelar
      </button>
    </div>
  );
}
