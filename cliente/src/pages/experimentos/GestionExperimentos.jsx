import { useEffect, useState } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import { BuscadorGestionExp } from "../../components/layout/BuscadorGestionExp";
import { searchGestionExperimentos, deleteExperimento } from "../../api/experimentos.api";
import { Play, Trash2, Send } from "lucide-react";
import { ConfirmarEliminarExp } from "../../components/modal/ConfirmarEliminarExp";

export function GestionExperimentos() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  // Modal de eliminar 
  const [showDelete, setShowDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // Buscar con debounce 
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchGestionExperimentos({ q });
        if (alive) setRows(Array.isArray(data?.results) ? data.results : []);
      } catch (e) {
        console.error(e);
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 300);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q]);

  const fmtFecha = (s) => {
    if (!s) return "—";

    const mDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (mDate) {
      const [, y, m, d] = mDate;
      return `${d}/${m}/${y}`;
    }

    try {
      const dt = new Date(s);
      return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dt);
    } catch {
      return s;
    }
  };

  // Acciones 
  // const onVer = (row) => {
    
  // };

  // const onEnviar = async (row) => {
   
  // };

  // Abrir modal
  const openDeleteModal = (row) => {
    setRowToDelete(row);
    setShowDelete(true);
  };

  const handleEliminar = async () => {
    if (!rowToDelete) return;
    try {
      await deleteExperimento(rowToDelete.tipo, rowToDelete.id_experimento);
      setRows((prev) =>
        prev.filter(
          (r) => !(r.id_experimento === rowToDelete.id_experimento && r.tipo === rowToDelete.tipo)
        )
      );
      setShowDelete(false);
      setRowToDelete(null);
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-5xl px-4 mx-auto mt-8">
        <h2 className="text-center text-2xl font-baloo text-pl_green_b dark:text-pl_white_a mb-6">
          Gestión de Experimentos
        </h2>

        {/* Searchbox */}
        <BuscadorGestionExp value={q} onChange={setQ} />

        {/* Tabla */}
        <div className="overflow-x-auto rounded-3xl shadow mt-10">
          <table className="min-w-full bg-white dark:bg-[#1b1f1b]">
            <thead>
              <tr className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80 font-nunito">
                <th className="text-left px-5 py-3 rounded-l-3xl">ID</th>
                <th className="text-left px-5 py-3">Tipo</th>
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="text-left px-5 py-3">Espacio</th>
                <th className="text-center px-5 py-3">Ver</th>
                <th className="text-center px-5 py-3">Eliminar</th>
                <th className="text-center px-5 py-3 rounded-r-3xl">Enviar</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center font-nunito">
                    Sin resultados
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={`${row.tipo}-${row.id_experimento}`}
                    className="border-b-2 border-pl_green_input last:border-0 font-nunito"
                  >
                    <td className="px-5 py-4">{String(row.id_experimento).padStart(4, "0")}</td>
                    <td className="px-5 py-4">{row.tipo}</td>
                    <td className="px-5 py-4">{fmtFecha(row.fecha)}</td>
                    <td className="px-5 py-4">
                      {row.espacio_nombre || `Espacio ${row.espacio_id}`}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        // onClick={() => onVer(row)}
                        className="p-2 rounded-full hover:bg-black/5"
                      >
                        <Play />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => openDeleteModal(row)}  // solo abre el modal
                        className="p-2 rounded-full hover:bg-black/5"
                      >
                        <Trash2 />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        // onClick={() => onEnviar(row)}
                        className="p-2 rounded-full hover:bg-black/5"
                      >
                        <Send />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmarEliminarExp
        visible={showDelete}
        onCancelar={() => {
          setShowDelete(false);
          setRowToDelete(null);
        }}
        onEliminar={handleEliminar}
      />
    </div>
  );
}
