/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import {
  accesorioVenta,
  createReportsAccesorio,
  listAccesorios,
  listEquipos,
  searchAccesorio,
} from "../API/events";
import { toast, Toaster } from "sonner";
import { PacmanLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { handleMessage } from "../helpers/index";

import Swal from "sweetalert2";

const Equipos = () => {
  //OBTENER LAS REFACCIONES DE LA DB
  const [equipos, setEquipos] = useState([]);
  const [search, setSearch] = useState();
  const [reload, setReload] = useState(false);
  let [loading, setLoading] = useState(false);

  //CONTADOR DE CARRO

  const sumarProducto = async (id) => {
    console.log("Venta", id);
    //PREGUNTAR SI SE REALIZARA LA VENTA

    (async () => {
      await Swal.fire({
        title: "Realizar Venta?",
        showCancelButton: true,
        confirmButtonText: `Vender`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire("Venta Realizada con exito!", "", "success");
          const response = await accesorioVenta(id);

          console.log(response.accesorioDB.precio);
          if (response.status === "Success") {
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

            //CREAR REPORTE DE VENTA Y GARANTIA
            const response2 = await createReportsAccesorio(
              tokenUser.id,
              id,
              response.accesorioDB.precio
            );

            console.log(response2);

            setTimeout(() => {
              Swal.fire(`${response2.mensaje}`);

              setTimeout(() => {
                //RECARGAR PAGINA
                window.location.reload();
              }, 2000);
            }, 2000);
          }
        }
      });
    })();
  };

  useEffect(() => {
    (async () => {
      
        const response = await listEquipos();
        console.log("Respuesta Equipos", response.equipos);
        setEquipos(response.equipos);
      
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
              <div className="flex justify-end mt-20 items-center gap-10 pr-10">
                {/* BUSCADOR Y CATEGORIAS */}
              
              </div>
              
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
                    item={equipos}
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

export default Equipos;
