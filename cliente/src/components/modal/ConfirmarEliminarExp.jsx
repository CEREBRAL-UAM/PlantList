// ConfirmarEliminarExp.jsx
import { motion, AnimatePresence } from "framer-motion";

export function ConfirmarEliminarExp({ visible, onCancelar, onEliminar }) {
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
          onClick={onCancelar} 
        >
          <motion.div
            className="bg-pl_green_a dark:bg-pl_green_c rounded-2xl
                       shadow-2xl p-6 w-[400px] text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className="text-xl font-nunito mb-4 text-pl_white_a">
              ¿Estás seguro de eliminar el experimento?
            </h2>
            <div className="flex justify-around">
              <button
                className="hover:text-pl_gray_dark_input text-pl_white_a font-nunito px-4 py-2"
                onClick={onCancelar}
              >
                Cancelar
              </button>
              <button
                className="hover:text-pl_green_b text-pl_white_a font-nunito px-4 py-2"
                onClick={onEliminar}
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
