/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import {
  accesorioVenta,
  createReportsAccesorio,
  listAccesorios,
  searchAccesorio,
} from "../API/events";
import { toast, Toaster } from "sonner";
import { PacmanLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { handleMessage } from "../helpers/index";

import { Link, Navigate } from "react-router-dom";

const Accesorios = () => {
  //OBTENER LAS REFACCIONES DE LA DB
  const [accesorios, setAccesorios] = useState([]);
  const [search, setSearch] = useState();
  const [reload, setReload] = useState(false);
  let [loading, setLoading] = useState(false);


  //CONTADOR DE CARRO

  const sumarProducto = async (id) => {
    if (id) {
      console.log("id seleccionado", id);
    }

    //GENERAR MENSAJE DE CONFIRMACION
    const confirm = window.confirm("Realizar venta?");
    if (confirm) {
      //REALIZAR VENTA EN DB
      const response = await accesorioVenta(id);

      console.log(response.accesorioDB.precio);
      if (response) {
        toast.promise(handleMessage, {
          style: {
            color: "white",
          },
          loading: "Loading...",
          success: () => {
            return `${response.message}`;
          },
          error: "Error",
        });
      }
      //RECARGAR

      //REALIZAR REPORTE DE VENTA
      const response2 = await createReportsAccesorio(tokenUser.id, id , response.accesorioDB.precio);

      if (response2) {
        setTimeout(() => {
          setLoading(false);
          toast.promise(handleMessage, {
            style: {
              color: "white",
            },
            loading: "Loading...",
            success: () => {
              return `${response2.mensaje}`;
            },
            error: "Error",
          });
          setTimeout(() => {
            window.location.reload();
            
          }, 4000);
        }, 4000);
      }

      
    } else {
      console.log("No se vendio");
    }
  };

  useEffect(() => {
    (async () => {
      if (search) {
        // console.log("Busqueda", search);
        const response = await searchAccesorio(search);
        // console.log(response.accesorios);
        setAccesorios();
        setAccesorios(response.accesorios);
        return;
      } else {
        const response = await listAccesorios();
        // console.log("Respuesta refacciones", response);
        setAccesorios(response.accesorios);
      }
      //REGRESAR RELOAD A ESTADO NORMAL
      setTimeout(() => {
        setReload(false);
      }, 1000);
    })();
  }, [search, reload, setReload, setLoading]);

  const { tokenUser } = useAuth();
  const user = tokenUser.id

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />

      {user ? (
        <div>
          <>
            <div>
              <div className="flex justify-end mt-10 items-center gap-10 pr-10">
                {/* BUSCADOR */}
                <div className="text-lg">
                  <label
                    htmlFor="default-search"
                    className="text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-4  pl-10 text-sm  border-b-2 border-gray-400
              rounded-lg bg-gray-100

"
                      placeholder="Cargador..."
                      required
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cursor-pointer flex justify-between">
                  {/* <Link to="/saleCard" cardCount={carCount}>
                    <LuShoppingCart className="text-4xl text-blue-600" />
                  </Link> */}
                  <h5 className="  p-1 uppercase rounded cursor-pointe transition-color">
                    {/* {carCount.length} */}
                  </h5>
                </div>
                {/* <h6 className="font-semibold">1</h6> */}
              </div>
              <h2 className="font-black mt-10 mb-20 text-4xl text-center">
                {/* {loading ? "Realizando Venta..." : "Lista de Refacciones"} */}
              </h2>
              <div className=" flex-wrap flex justify-center md:flex mx-8">
                {loading ? (
                  <PacmanLoader
                    loading={loading}
                    size={40}
                    color={"#cc6b03"}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <ListCard
                    item={accesorios}
                    loading={loading}
                    setLoading={setLoading}
                    sumarProducto={sumarProducto}
                  />
                )}
              </div>
            </div>
          </>
        </div>
      ) : (
        // <Navigate to="/login" />
        ""
      )}
    </>
  );
};

export default Accesorios;
