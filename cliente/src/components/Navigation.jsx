import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="p-4">
      <ul className="flex justify-around">
        <li>
          <Link to="/plantlist/plantas">Plantas</Link>
        </li>
        <li>
          <Link
            to="/plantlist/plantas/AgregarPlanta"
            className="hover:text-gray-300"
          >
            Agregar Planta
          </Link>
        </li>
        <li>
          <Link
            to="/plantlist/especies/AgregarEspecie"
            className="hover:text-gray-300"
          >
            Agregar Especie
          </Link>
        </li>
      </ul>
    </nav>
  );
}
