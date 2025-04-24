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

import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaPlusCircle } from "react-icons/fa";

const Accesorios = () => {
  //OBTENER LAS REFACCIONES DE LA DB
  const [accesorios, setAccesorios] = useState([]);
  const [search, setSearch] = useState();
  const [reload, setReload] = useState(false);
  let [loading, setLoading] = useState(false);

// ========================================
//           TOTAL -> CARRITO
// ========================================
  const { totalItems } = useCart();
 

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
  const user = tokenUser.id;

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
              <div className="">
                
                   {/* ========================================
                                      HEADER 
                      ========================================  */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                          {/* ========================================
                                          ADD ACCESORIO 
                            ========================================  */}
                            <Link
                            to="/FormularioAccesorio"
                            type="button"
                            className=""
                          >
                            <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                              </svg>
                              Agregar Producto
                            </button>
                          </Link>

                        {/* ========================================
                                          BUSCADOR 
                            ========================================  */}
                        <div className="">
                          </div>
                          <div className="flex-1 max-w-2xl mx-4">
                          {/* <h2>Categorias</h2> */}
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


                        {/* ========================================
                                      CARRITO 
                            ========================================  */}
                        <Link to="/cart">  
                          <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                          </div>
                        </Link>

                     </div>
                </header>
                  {/* ======================================== */}



              </div>

              <div className=" flex-wrap flex justify-center md:flex mx-8 mt-10">
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
