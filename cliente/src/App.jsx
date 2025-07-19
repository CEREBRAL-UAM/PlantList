import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RegistrarCuenta } from "./pages/usuario/RegistrarCuenta";
import { IniciarSesion } from "./pages/usuario/IniciarSesion";
import { Especies } from "./pages/plantas/Especies";
import { Espacios } from "./pages/espacios/Espacios";
import { VerEspacio } from "./pages/espacios/VerEspacio";
import { FormPlanta } from "./pages/plantas/FormPlanta";
import { HeaderEscritorio } from "./components/layout/HeaderEscritorio";
import { VerPlanta } from "./pages/plantas/VerPlanta";
import { FormEspecie } from "./pages/plantas/FormEspecie";
import { FormEspacio } from "./pages/espacios/FormEspacio";
import { PantallaCarga } from "./pages/common/PantallaCarga";
import { VerUsuario } from "./pages/usuario/VerUsuario";
import { Experimentos } from "./pages/experimentos/Experimentos";
import { MonitorearPlanta } from "./pages/monitoreo/MonitorearPlanta";
import { RealizarExperimento } from "./pages/experimentos/RealizarExperimento";
import { GestionExperimentos } from "./pages/experimentos/GestionExperimentos";
import { Home } from "./pages/common/Home";
import { Colaboradores } from "./pages/espacios/Colaboradores";
import { Monitoreo } from "./pages/monitoreo/Monitoreo";
import { MonitoreoAmbiental } from "./pages/monitoreo/MonitoreoAmbiental";
import { MonitoreoSuelo } from "./pages/monitoreo/MonitoreoSuelo";
import { MonitoreoContaminantes } from "./pages/monitoreo/MonitoreoContaminantes";

function AppRoutes() {
  const location = useLocation();
  const hideHeaderOnRoutes = [
    "/biolink_ipc/login",
    "/biolink_ipc/registro",
    "/biolink_ipc/loading",
  ];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <HeaderEscritorio />}
      <Routes>
        <Route path="/biolink_ipc/registro" element={<RegistrarCuenta />} />
        <Route
          path="/biolink_ipc/colaboradores/:id_espacios"
          element={<Colaboradores />}
        />
        <Route path="/biolink_ipc/login" element={<IniciarSesion />} />
        <Route path="/biolink_ipc/home" element={<Home />} />
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
        <Route path="/biolink_ipc/experimentos" element={<Experimentos />} />
        <Route
          path="/biolink_ipc/MonitorearPlanta"
          element={<MonitorearPlanta />}
        />
        <Route
          path="/biolink_ipc/RealizarExperimento"
          element={<RealizarExperimento />}
        />
        <Route
          path="/biolink_ipc/GestionExperimentos"
          element={<GestionExperimentos />}
        />
        <Route path="/biolink_ipc/monitoreo" element={<Monitoreo />} />
        <Route
          path="/biolink_ipc/monitoreoAmbiental"
          element={<MonitoreoAmbiental />}
        />
        <Route
          path="/biolink_ipc/monitoreoSuelo"
          element={<MonitoreoSuelo />}
        />
        <Route
          path="/biolink_ipc/monitoreoContaminantes"
          element={<MonitoreoContaminantes />}
        />
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
