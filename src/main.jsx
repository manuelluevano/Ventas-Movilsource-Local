import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import "./index.css";

//CONTEXT
import { AuthProvider } from "./context/AuthProvider.jsx";

//LOADERS
// import { loader as appLoader } from "./components/Headers";
import { loader as serviceLoader } from "./pages/Servicios";

//COMPONENTS
import ErrorElement from "./components/ErrorElement.jsx";
import Headers from "./components/Headers.jsx";

//PAGES
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Perfil from "./pages/Perfil";
import Servicios from "./pages/Servicios";
import Administrador from "./pages/administrador.jsx";
import Accesorios from "./pages/Accesorios";
import Pendientes from "./pages/Pendientes.jsx";
import FormularioAccesorio from "./components/FormularioAccesorio.jsx";
import Equipos from "./pages/Equipos.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CartDropdown from "./components/CartDropdown.jsx";
// import RequireAuth from "./helpers/RequireAuth.js";

const router = createHashRouter([
  {
    path: "/",
    // element: <RequireAuth allowRoles={"admin"} />,
    // loader: appLoader,
    element: <Headers/>,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <App />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/perfil",
        element: <Perfil />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/servicios",
        element: <Servicios />,
        errorElement: <ErrorElement />,
        loader: serviceLoader,
      },
      {
        path: "/administrador",
        element: <Administrador />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/accesorios",
        element: <Accesorios />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/pendientes",
        element: <Pendientes />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/FormularioAccesorio/:id?",
        element: <FormularioAccesorio />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/equipos",
        element: <Equipos />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/cart",
        element: <CartDropdown />,
        errorElement: <ErrorElement />,
      },
      // {
      //   path: "/saleCard",
      //   element: <SaleCard />,
      //   errorElement: <ErrorElement />,
      // },
      // {
      //   path: "/add-refaccion/:id?",
      //   element: <UploadImage />,
      //   errorElement: <ErrorElement />,
      //   // loader: serviceLoader
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <CartProvider>
      <RouterProvider router={router}></RouterProvider>
    </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
