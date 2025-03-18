import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistrarCuenta } from "./pages/RegistrarCuenta";
import { IniciarSesion } from "./pages/IniciarSesion";
import { Plantas } from "./pages/Plantas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/plantlist/registro" element={<RegistrarCuenta />} />
        <Route path="/plantlist/login" element={<IniciarSesion />} />
        <Route path="/plantlist/plantas" element={<Plantas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
