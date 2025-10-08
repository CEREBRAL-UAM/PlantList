import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function ConfirmarGrabacion({ visible, onCancelar, navState }) {
  const navigate = useNavigate();

  const handleComenzar = () => {
    // Encadena el state hacia la ruta de cuenta regresiva
    navigate("/biolink_ipc/cuentaRegresiva", { state: navState });
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center
                     bg-white/50 dark:bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-pl_green_a dark:bg-pl_green_c rounded-2xl
                       shadow-2xl p-6 w-[400px] text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-nunito mb-4 text-pl_white_a">
              ¿Desea comenzar la grabación?
            </h2>
            <p className="font-baloo text-pl_white_a mb-6">
              Se comenzarán a recolectar los datos del experimento, así como se
              comenzará a grabar la pantalla y el video de la cámara.
            </p>
            <div className="flex justify-around">
              <button
                className="hover:text-pl_gray_dark_input text-pl_white_a font-nunito px-4 py-2"
                onClick={onCancelar}
              >
                Cancelar
              </button>
              <button
                className="hover:text-pl_green_b text-pl_white_a font-nunito px-4 py-2"
                onClick={handleComenzar}
              >
                Comenzar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
