import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HeaderEscritorio } from "./components/layout/HeaderEscritorio";
import { HeaderMovil } from "./components/layout/HeaderMovil";
import { CuentaRegresiva } from "./components/visuales/CuentaRegresiva";
import { Home } from "./pages/common/Home";
import { PantallaCarga } from "./pages/common/PantallaCarga";
import { Colaboradores } from "./pages/espacios/Colaboradores";
import { Espacios } from "./pages/espacios/Espacios";
import { FormEspacio } from "./pages/espacios/FormEspacio";
import { VerEspacio } from "./pages/espacios/VerEspacio";
import { ExperimentoProceso } from "./pages/experimentos/ExperimentoProceso";
import { Experimentos } from "./pages/experimentos/Experimentos";
import { GestionExperimentos } from "./pages/experimentos/GestionExperimentos";
import { MonitorearPlanta } from "./pages/experimentos/MonitorearPlanta";
import { RealizarExperimento } from "./pages/experimentos/RealizarExperimento";
import { RutasProtegidas } from "./pages/experimentos/RutasProtegidas";
import { Monitoreo } from "./pages/monitoreo/Monitoreo";
import { MonitoreoAmbiental } from "./pages/monitoreo/MonitoreoAmbiental";
import { MonitoreoContaminantes } from "./pages/monitoreo/MonitoreoContaminantes";
import { MonitoreoSuelo } from "./pages/monitoreo/MonitoreoSuelo";
import { Especies } from "./pages/plantas/Especies";
import { FormEspecie } from "./pages/plantas/FormEspecie";
import { FormPlanta } from "./pages/plantas/FormPlanta";
import { VerPlanta } from "./pages/plantas/VerPlanta";
import { IniciarSesion } from "./pages/usuario/IniciarSesion";
import { RegistrarCuenta } from "./pages/usuario/RegistrarCuenta";
import { VerUsuario } from "./pages/usuario/VerUsuario";
{/*por si se me olvida aguegué Navigate en from "react-router-dom" */}

function AppRoutes() {
  const location = useLocation();
  const hideHeaderOnRoutes = [
    "/biolink_ipc/login",
    "/biolink_ipc/registro",
    "/biolink_ipc/loading",
    "/biolink_ipc/cuentaRegresiva",
  ];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <HeaderEscritorio />}
      <Routes>
        <Route path="/" element={<Navigate to="/biolink_ipc/login" />} />  {/*REDIRECT lo agregue para que me llevara al login */}
        <Route path="/biolink_ipc/registro" element={<RegistrarCuenta />} />
        <Route
          path="/biolink_ipc/colaboradores/:id_espacios"
          element={<Colaboradores />}
        />
        <Route path="/biolink_ipc/login" element={<IniciarSesion />} />
        <Route path="/biolink_ipc/home" element={<Home />} />
        <Route path="/biolink_ipc/loading" element={<PantallaCarga />} />
        <Route
          path="/biolink_ipc/plantas/AgregarPlanta/:id_espacios"//aqui se deberia cambiar?
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
        <Route element={<RutasProtegidas />}>
          <Route path="/biolink_ipc/experimentos" element={<Experimentos />} />
          <Route path="/biolink_ipc/MonitorearPlanta" element={<MonitorearPlanta />} />
          <Route path="/biolink_ipc/RealizarExperimento" element={<RealizarExperimento />} />
          <Route path="/biolink_ipc/GestionExperimentos" element={<GestionExperimentos />} />
          <Route path="/biolink_ipc/ExperimentoProceso" element={<ExperimentoProceso />} />
          <Route path="/biolink_ipc/cuentaRegresiva" element={<CuentaRegresiva />} />
        </Route>
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
      {!shouldHideHeader && <HeaderMovil />}
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
