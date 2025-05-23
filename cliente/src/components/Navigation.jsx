import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="p-4 bg-plantlist_green">
      <ul className="flex justify-around">
        <li>
          <Link to="/plantlist/espacios" className="hover:text-gray-300">
            Espacios
          </Link>
        </li>
        <li>
          <Link to="/plantlist/especies" className="hover:text-gray-300">
            Especies
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
