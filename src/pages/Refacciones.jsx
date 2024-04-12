/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import { listRefacciones, searchRefaccion } from "../API/events";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import {  PacmanLoader } from "react-spinners";

const Refacciones = () => {
  //OBTENER LAS REFACCIONES DE LA DB
  const [refacciones, setRefacciones] = useState([]);
  const [search, setSearch] = useState();
  const [reload, setReload] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (search) {
        // console.log("search, VALOR", search);
        const response = await searchRefaccion(search);
        setRefacciones();
        setRefacciones(response.refacciones);
      } else {
        const response = await listRefacciones();
        // console.log("Respuesta refacciones", response);
        setRefacciones(response.refacciones);
      }
      //REGRESAR RELOAD A ESTADO NORMAL
      setTimeout(() => {
        setReload(false);
      }, 4000);
    })();
  }, [search, reload, setReload]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />
      <div className="flex justify-end mt-10 items-center gap-10 pr-10">
        <Link
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="/add-refaccion"
        >
          Agregar
        </Link>
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
              rounded-lg bg-gray-200

"
              placeholder="Display iPhone..."
              required
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <h2 className="font-black mt-10 mb-20 text-4xl text-center">
        {loading ? "Realizando Venta..." : "Lista de Refacciones"}
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
            refacciones={refacciones}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
};

export default Refacciones;
