import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistrarCuenta } from "./pages/RegistrarCuenta";
import { IniciarSesion } from "./pages/IniciarSesion";
import { Plantas } from "./pages/Plantas";
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
          path="/plantlist/plantas/AgregarPlanta"
          element={<FormPlanta />}
        />
        <Route path="/plantlist/plantas/:id" element={<VerPlanta />} />
        <Route
          path="/plantlist/especies/AgregarEspecie"
          element={<FormEspecie />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
