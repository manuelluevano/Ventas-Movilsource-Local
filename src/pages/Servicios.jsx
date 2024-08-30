import { useEffect, useState } from "react";
import { listServices, searchService } from "../API/events";
import FormularioServicio from "../components/FormularioServicio";
import ListaServicios from "../components/ListaServicios";
import useAuth from "../hooks/useAuth";
import { Navigate, useLoaderData } from "react-router-dom";
import { handleDate } from "../helpers";
import { Toaster } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  //OBTENER FECHA ACTUAL
  const f = await handleDate();

  
  return f;
}

const Servicios = () => {
  const { reload, setReload } = useAuth();

  const datos = useLoaderData();

  const { tokenUser } = useAuth();
  const [listaServicios, setListaServicios] = useState([]);
  const [search, setSearch] = useState();

  useEffect(() => {
    (async () => {
      if (search) {
        console.log("search, VALOR", search);
        const response = await searchService(search);
        setListaServicios();
        setListaServicios(response);
        return;
      } else {
        const token = localStorage.getItem("token");
        //OBTENER LISTA DE SERVICIOS
        const response = await listServices(token);
        setListaServicios(response);
        console.log("Lista servicios", response);
        
      }
      //REGRESAR RELOAD A ESTADO NORMAL
      setTimeout(() => {
        setReload(false);
      }, 4000);
    })();
  }, [reload, search, setReload]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />
      {tokenUser.id ? (
        <div className="container mx-auto ">
          <div className="md:flex">
            <FormularioServicio fecha={datos} contadorFolio={listaServicios.contador}  />


            <ListaServicios
              listaServicios={listaServicios.services}
              contador={listaServicios.contador}
              servicesPendient={listaServicios.servicesPendient}
              servicesFinished={listaServicios.servicesFinished}
              reload={reload}
              setReload={setReload}
              setSearch={setSearch}
              search={search}
            />
          </div>
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default Servicios;
