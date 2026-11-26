import { createBrowserRouter, Navigate } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Servicios from "./pages/Servicios";
import CategoriasList from "./pages/CategoriasList";
import CategoriaDetalle from "./pages/CategoriaDetalle";
// import ServicioDetalle from "./pages/ServicioDetalle"; // desactivado temporalmente

// Redirect components (no JSX needed — Navigate is a component, createElement handles it)
const ToServicios = () => Navigate({ to: "/servicios", replace: true });
const ToHome = () => Navigate({ to: "/", replace: true });

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "home2", Component: Home2 },
      { path: "servicios", Component: Servicios },
      // { path: "servicios/:path", Component: ServicioDetalle }, // desactivado temporalmente
      { path: "categorias", Component: CategoriasList },
      { path: "categorias/:slug", Component: CategoriaDetalle },
      { path: "categorias/:slug/:servicePath", Component: CategoriaDetalle },
      // Redirige /servicios/:path al catálogo mientras esté desactivado
      { path: "servicios/:path", Component: ToServicios },
      // Catch-all: cualquier ruta desconocida va a Home
      { path: "*", Component: ToHome },
    ],
  },
]);
