import { BotonAtras } from "./botones/BotonAtras";

export function SecHeader({ dir }) {
  return (
    <div className="w-full bg-amber-700">
      <BotonAtras dir={dir} />{" "}
    </div>
  );
}
