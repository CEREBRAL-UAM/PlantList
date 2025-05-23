import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistrarCuenta } from "./pages/RegistrarCuenta";
import { IniciarSesion } from "./pages/IniciarSesion";
import { Plantas } from "./pages/Plantas";
import { Especies } from "./pages/Especies";
import { Espacios } from "./pages/Espacios";
import { VerEspacio } from "./pages/VerEspacio";
import { FormPlanta } from "./pages/FormPlanta";
import { Navigation } from "./components/Navigation";
import { VerPlanta } from "./pages/VerPlanta";
import { FormEspecie } from "./pages/FormEspecie";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/plantlist/registro" element={<RegistrarCuenta />} />
        <Route path="/plantlist/login" element={<IniciarSesion />} />
        <Route path="/plantlist/plantas" element={<Plantas />} />
        <Route
          path="/plantlist/plantas/AgregarPlanta/:id_espacios"
          element={<FormPlanta />}
        />
        <Route path="/plantlist/plantas/:id" element={<VerPlanta />} />
        <Route
          path="/plantlist/especies/AgregarEspecie"
          element={<FormEspecie />}
        />
        <Route path="/plantlist/especies" element={<Especies />} />
        <Route path="/plantlist/espacios" element={<Espacios />} />
        <Route
          path="/plantlist/VerEspacio/:id_espacios"
          element={<VerEspacio />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
