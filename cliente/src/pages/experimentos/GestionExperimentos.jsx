import { useEffect, useState } from "react";
import { BannerUsuario } from "../../components/layout/BannerUsuario";
import {
  searchGestionExperimentos,
  deleteExperimento,
  getTipoEstimulacion,
} from "../../api/experimentos.api";
import { getEspaciosUsuario } from "../../api/espacios.api";
import { Play, Trash2, Send } from "lucide-react";
import { ConfirmarEliminarExp } from "../../components/modal/ConfirmarEliminarExp";
import { BuscadorGestionExp } from "../../components/layout/BuscadorGestionExp";

export function GestionExperimentos() {
  // Filtros
  const [espacioId, setEspacioId] = useState("");
  const [tipoId, setTipoId] = useState("");
  
  // Buscador
  const [searchTexto, setSearchTexto] = useState("");
  const [searchFecha, setSearchFecha] = useState(""); // YYYY-MM-DD
  const [searchHora, setSearchHora] = useState("");   // HH:MM
  
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const [espacios, setEspacios] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [search, setSearch] = useState("");

  // Modal eliminar
  const [showDelete, setShowDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [showModalAnim, setShowModalAnim] = useState(false);

  useEffect(() => {
    getEspaciosUsuario().then(({ data }) => setEspacios(data ?? []));
    getTipoEstimulacion().then(({ data }) => setTipos(data ?? []));
  }, []);

  // Buscar
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchGestionExperimentos({
          espacio_id: espacioId,
          tipo_id: tipoId,
          fecha: searchFecha,
          hora: searchHora,
        });
        if (alive) setRows(data?.results ?? []);
      } catch {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 300);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [espacioId, tipoId, searchFecha, searchHora]);

  const fmtFecha = (s) => {
    if (!s) return "—";
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
  };

  const fmtHora = (s) => {
    if (!s) return "—";
    try {
      const dt = new Date(s);
      return new Intl.DateTimeFormat("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(dt);
    } catch {
      return s;
    }
  };

  // Filtrado inmediato 
  const rowsFiltradas = searchTexto
    ? rows.filter((r) => {
        const t = searchTexto.toLowerCase();
        return (
          r.tipo_estimulacion?.toLowerCase().includes(t) ||
          r.espacio_nombre?.toLowerCase().includes(t) ||
          fmtFecha(r.Fecha_Sensado).startsWith(t) ||
          fmtHora(r.Hora_inicio).startsWith(t)
        );
      })
    : rows;

  // Abrir modal
  const openDeleteModal = (row) => {
    setRowToDelete(row);
    setShowDelete(true);
  };

  const handleEliminar = async () => {
    if (!rowToDelete) return;
    try {
      await deleteExperimento(rowToDelete.id_Experimento);
      setRows((prev) =>
        prev.filter((r) => r.id_Experimento !== rowToDelete.id_Experimento)
      );
      setShowDelete(false);
      setRowToDelete(null);
    } catch {
      alert("No se pudo eliminar.");
    }
  };

  // Animación al cerrar modal de video
  const closeModal = () => {
    setShowModalAnim(false);
    setTimeout(() => setVideoModalUrl(null), 200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:pt-2">
      <BannerUsuario />

      <div className="w-full max-w-5xl px-4 mx-auto mt-10">
        <h1 className="text-center text-2xl font-bold font-nunito text-pl_green_b dark:text-pl_white_a mb-6">
          GESTIÓN DE EXPERIMENTOS
        </h1>

        {/* Barra de busqueda */}
        <BuscadorGestionExp
          value={searchTexto}
          onChange={(texto, fecha, hora) => {
            setSearchTexto(texto);
            setSearchFecha(fecha);
            setSearchHora(hora);
          }}
        />

        {/* Tabla */}
        <div className="overflow-x-auto rounded-3xl shadow mt-10">
          <table className="min-w-full bg-white dark:bg-[#1b1f1b]">
            <thead>
              <tr className="bg-pl_green_input dark:bg-[#A3AE9A] text-pl_green_b/80 font-nunito">
                <th className="text-center px-5 py-3 rounded-l-3xl">ID</th>
                <th className="text-center px-5 py-3">Estimulación</th>
                <th className="text-center px-5 py-3">Fecha</th>
                <th className="text-center px-5 py-3">Inicio</th>
                <th className="text-center px-5 py-3">Fin</th>
                <th className="text-center px-5 py-3">Espacio</th>
                <th className="text-center px-5 py-3">Ver</th>
                <th className="text-center px-5 py-3">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-6 text-center font-nunito text-pl_green_b/80"
                  >
                    {loading ? "Buscando..." : "Sin resultados"}
                  </td>
                </tr>
              ) : (
                rowsFiltradas.map((row) => (
                  <tr
                    key={row.id_Experimento}
                    className="border-b-2 border-pl_green_input last:border-0 font-nunito text-pl_green_b"
                  >
                    <td className="px-5 py-4 text-center">
                      {String(row.id_Experimento).padStart(4, "0")}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {row.tipo_estimulacion || "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {fmtFecha(row.Fecha_Sensado)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {fmtHora(row.Hora_inicio)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {fmtHora(row.Hora_fin)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {row.espacio_nombre || "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {row.video_url ? (
                        <button
                          onClick={() => {
                            setVideoModalUrl(row.video_url);
                            setTimeout(() => setShowModalAnim(true), 10);
                          }}
                          className="p-2 rounded-full hover:bg-black/5"
                        >
                          <Play />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => openDeleteModal(row)}
                        className="p-2 rounded-full hover:bg-black/5"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmarEliminarExp
        visible={showDelete}
        onCancelar={() => {
          setShowDelete(false);
          setRowToDelete(null);
        }}
        onEliminar={handleEliminar}
      />

      {videoModalUrl && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
            showModalAnim ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`relative bg-white dark:bg-[#1b1f1b] p-6 rounded-3xl shadow-2xl max-w-3xl w-full mx-4 transform transition-all duration-200 ${
              showModalAnim
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-3 right-4 z-50 bg-white/80 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow transition"
            >
              ✕
            </button>

            {/* Video */}
            <video
              src={videoModalUrl}
              controls
              autoPlay
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
