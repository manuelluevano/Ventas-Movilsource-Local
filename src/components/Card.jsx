/* eslint-disable react/prop-types */

// import { createReports } from "../API/events";
import { Toaster, toast } from "sonner";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import { LuShoppingCart } from "react-icons/lu";

const Card = ({ item, sumarProducto, loading }) => {
  const { _id, nombre, imagen, precio, stock } = item;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />


   
      {/* //MODAL  */}
{showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                 
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <img className="" src={`${imagen}`} alt="Imagen no disponible" />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}



      <div
        className={`${
          stock == 0
            ? "opacity-30"
            : " hover:bg-gray-200 hover:border hover:border-gray-400 transition-all cursor-pointer"
        }  mr-16 text-center mx-0  mb-10 max-w-xs border border-gray-200 rounded-lg shadow `}
      >

          <button className="" onClick={() => setShowModal(true)}>
        <div className="flex justify-center w-72 h-52">
          {stock == 0 && (
            <h1 className="absolute text-center text-4xl text-red-700 ">Agotada</h1>
          )}
          <img  src={`${imagen}`} alt="Imagen no disponible" />
          
        </div>
        </button>
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
