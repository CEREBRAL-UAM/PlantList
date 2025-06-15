import { useNavigate } from "react-router";

export function BotonAtras({ dir }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        console.log("clic");
        navigate(dir);
      }}
      className="bg-amber-300"
    >
      Atras
    </button>
  );
}
