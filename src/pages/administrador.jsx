import { FcMultipleSmartphones } from "react-icons/fc";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Children, useEffect, useState } from "react";
import { listAccesorios } from "../API/events";

const Administrador = () => {
  const [list, setList] = useState();
  useEffect(() => {
    (async () => {
      const response = await listAccesorios();
      setList(response.accesorios);
    })();
  }, []);


  return (
    <div className="container mx-auto">
      <div className="mt-3 md:flex">
        <div className="md:w-2/5 lg:w-2/5 mt-10 h-screen ">
          <h2 className="font-bold text-3xl">Administración</h2>

          <div className="grid gap-1 mt-10">
            <div className="flex items-center mb-5 ">
              <FcMultipleSmartphones className="text-4xl " />

              <a
                href="index.html"
                className="ml-5 text-xl hover:text-2xl transition-all"
              >
                Accesorios
              </a>
            </div>
            <div className="flex items-center ">
              <FaBook className="text-4xl" />

              <a
                href="index.html"
                className="ml-5 text-xl hover:text-2xl transition-all"
              >
                Pedidos
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-medium text-center text-cyan-600">
            Accesorios
          </h2>
          <Link
            to="/FormularioAccesorio"
            type="button"
            className="items-center py=2 p-3 mt-5 font-semibold text-white bg-green-500 hover:bg-green-600 hover:text-white  rounded-lg"
          >
            <FaPlusCircle className="mr-2 text-xl" />
            Agregar Nuevo
          </Link>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-16 py-3">
                    Imagen
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {list?.map((item) => {
                  return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="p-4">
                        <img
                          className="w-10 "
                          src={`${item.imagen}`}
                          alt="Imagen no disponible"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {item.nombre}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {item.stock}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ${item.precio}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          className="font-medium text-green-600 dark:text-green-500 hover:underline"
                          to={{ pathname: `/FormularioAccesorio/${item._id}`  }}
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administrador;
