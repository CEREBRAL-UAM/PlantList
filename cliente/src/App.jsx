import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import { FormEspacio } from "./pages/FormEspacio";
import { PantallaCarga } from "./pages/PantallaCarga";
import { VerUsuario } from "./pages/VerUsuario";
import {Experimentos} from "./pages/Experimentos";
import { Home } from "./pages/Home";
import { Colaboradores } from "./pages/Colaboradores";

function AppRoutes() {
  const location = useLocation();
  const hideHeaderOnRoutes = [
    "/biolink_ipc/login",
    "/biolink_ipc/registro",
    "/biolink_ipc/loading",
    "/biolink_ipc/experimentos",
  ];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Navigation />}
      <Routes>
        <Route path="/biolink_ipc/registro" element={<RegistrarCuenta />} />
        <Route
          path="/biolink_ipc/colaboradores/:id_espacios"
          element={<Colaboradores />}
        />
        <Route path="/biolink_ipc/login" element={<IniciarSesion />} />
        <Route path="/biolink_ipc/home" element={<Home />} />
        <Route path="/biolink_ipc/plantas" element={<Plantas />} />
        <Route path="/biolink_ipc/loading" element={<PantallaCarga />} />
        <Route
          path="/biolink_ipc/plantas/AgregarPlanta/:id_espacios"
          element={<FormPlanta />}
        />
        <Route path="/biolink_ipc/plantas/:id" element={<VerPlanta />} />
        <Route
          path="/biolink_ipc/especies/AgregarEspecie"
          element={<FormEspecie />}
        />
        <Route path="/biolink_ipc/especies" element={<Especies />} />
        <Route path="/biolink_ipc/espacios" element={<Espacios />} />
        <Route path="/biolink_ipc/AgregarEspacio" element={<FormEspacio />} />
        <Route path="/biolink_ipc/Perfil" element={<VerUsuario />} />
        <Route
          path="/biolink_ipc/VerEspacio/:id_espacios"
          element={<VerEspacio />}
        />
        <Route path="/biolink_ipc/experimentos" element={<Experimentos/>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
