/* eslint-disable react/prop-types */

// import { createReports } from "../API/events";
import { Toaster, toast } from "sonner";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import { LuShoppingCart } from "react-icons/lu";

const Card = ({ item, sumarProducto, loading }) => {
  const { _id, nombre, imagen, precio, stock } = item;

  // const handleCreateReport = async (id, stock) => {
  //   //REVISAR CANTIDAD DE ELEEMENTOS VENDIDOS
  //   if (stock > 0) {
  //     //GENERAMOS REPORTE
  //     const confirm = window.confirm("Vender Refaccion?");

  //     if (confirm) {
  //       setLoading(true);
  //       //OBTENER FECHA
  //       const f = await handleDate();
  //       console.log(f);

  //       const response = await createReports(id, f);
  //       console.log(response);

  //       if (response) {
  //         toast.promise(handleMessage, {
  //           style: {
  //             color: "white",
  //           },
  //           loading: "Loading...",
  //           success: () => {
  //             return `${response.mensaje}`;
  //           },
  //           error: "Error",
  //         });
  //       }
  //       //RECARGAR
  //       setTimeout(() => {
  //         setLoading(false);
  //         window.location.reload(true);
  //       }, 4000);
  //     }
  //   }
  // };


  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />

      <div
        className={`${
          stock == 0
            ? "opacity-30"
            : " hover:bg-gray-200 hover:border hover:border-gray-400 transition-all cursor-pointer"
        }  mr-16 text-center mx-0  mb-10 max-w-xs border border-gray-200 rounded-lg shadow `}
      >
        <div className="flex justify-center w-72 h-52">
          {stock == 0 && (
            <h1 className="text-center text-4xl text-red-700">Agotada</h1>
          )}
          <img className="" src={`${imagen}`} alt="Imagen no disponible" />
        </div>
        <div className="px-3 pt-1 pb-2 mb-2">
          <div href="#">
            <h5 className="text-lg font-semibold tracking-tight text-black ">
              {nombre}
            </h5>
          </div>
          <div className="flex justify-between mt-1">
            {/* <p className="text-sm mt-1 mb-1 text-green-600">
              TIPO: <span className="text-black"></span>{" "}
            </p> */}
            <p className="text-sm mt-1 mb-1 text-orange-600">
              STOCK: <span className="text-black">{stock}</span>{" "}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xl font-bold text-black ">${precio}</span>

            {stock == 0 ? (
              ""
            ) : (
              <button
                onClick={() => {sumarProducto(_id)}}
                href="#refacciones"
                className="text-4xl text-blue-700 hover:text-blue-900 "

              >
                <IoAddCircle />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
