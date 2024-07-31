/* eslint-disable react/prop-types */
import { useState } from "react";
import Servicio from "./Servicio";

const ListaServicios = ({
  listaServicios,
  setSearch,
  search,
  servicesPendient,
  servicesFinished,
  setServiceEdit,
  serviceEdit,
}) => {

  const [filter, setFilter] = useState(false);

  const filtro = listaServicios?.filter((item) => {
    return item.status == filter;
  });


  const filtrarFinalizados = async () => {
    setFilter(true)
  };
  const filtrarRestantes = async () => {
    setFilter(false)
  };
  return (
    <>
      <div className="md:w-1/2 lg:w-3/5 mt-10 h-screen md:overflow-y-scroll">
       

        <p className="text-right mr-2  mt-4 mb-4">
          {/* <button
            type="button"
            className="py=2 p-2  text-black hover:bg-gray-600 hover:text-white  rounded-lg"
            //  onClick={() => handlePendientes()}
          >
            TOTAL DE SERVICIOS:
            <span className=" ml-2 text-gray-700 text-2xl hover:text-white">
              {listaServicios?.length}
            </span>
          </button> */}
        </p>
        <p className="text-right mr-2  mt-4 mb-4">
          <button
            type="button"
            className="py=2 p-2  text-black hover:bg-green-600 hover:text-white  rounded-lg"
            onClick={() => filtrarFinalizados()}
          >
            Entregados:
            <span className=" ml-2 text-green-700 text-2xl hover:text-white">
              {servicesFinished}
            </span>
          </button>
        </p>
        <p className="text-right mr-2 mt-4 mb-4">
          <button
            type="button"
            className="py=2 p-2  text-black hover:bg-red-400 hover:text-white  rounded-lg"
            onClick={() => filtrarRestantes()}
          >
            Pendientes:
            <span className="ml-2 text-red-700 text-2xl hover:text-white">
              {servicesPendient}
            </span>
          </button>
        </p>
        {/* BUSCADOR */}
        <div className="text-lg mb-5">
          <label
            htmlFor="default-search"
            className="text-sm font-medium  text-gray-400 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http:www.w3.org/2000/svg"
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
              className="block w-full justify-center items-center p-4 pl-10 text-sm bg-gray-200 border-b-2 border-gray-500
 "
              placeholder="Display iPhone..."
              required
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <button
             type="submit"
             className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           >
             Buscar
           </button> */}
          </div>
        </div>
        {filtro?.map((item) => {
          return (
            <div key={item.id}>
              <Servicio
                key={item._id}
                item={item}
                setServiceEdit={setServiceEdit}
                serviceEdit={serviceEdit}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

//   return (
//     <div className="md:w-1/2 lg:w-3/5 mt-10 h-screen md:overflow-y-scroll">
//       <p className="text-right mr-2  mt-4 mb-4">
//         <button
//           type="button"
//           className="py=2 p-2  text-black hover:bg-gray-600 hover:text-white  rounded-lg"
//           onClick={() => handlePendientes()}
//         >
//           Total:
//           <span className=" ml-2 text-gray-700 text-2xl hover:text-white">
//             {contador}
//           </span>
//         </button>
//       </p>
//       <p className="text-right mr-2  mt-4 mb-4">
//         <button
//           type="button"
//           className="py=2 p-2  text-black hover:bg-green-600 hover:text-white  rounded-lg"
//           onClick={() => handlePendientes()}
//         >
//           Finalizados:
//           <span className=" ml-2 text-green-700 text-2xl hover:text-white">
//             {servicesFinished}
//           </span>
//         </button>
//       </p>
//       <p className="text-right mr-2  mt-4 mb-4">
//         <button
//           type="button"
//           className="py=2 p-2  text-black hover:bg-red-400 hover:text-white  rounded-lg"
//           onClick={() => handlePendientes()}
//         >
//           Pendientes:
//           <span className=" ml-2 text-red-700 text-2xl hover:text-white">
//             {servicesPendient}
//           </span>
//         </button>
//       </p>
//       {/* BUSCADOR */}
//       <div className="text-lg mb-5">
//         <label
//           htmlFor="default-search"
//           className="text-sm font-medium  text-gray-400 sr-only dark:text-white"
//         >
//           Search
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg
//               className="w-4 h-4 text-gray-500 dark:text-gray-400"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//               />
//             </svg>
//           </div>
//           <input
//             type="search"
//             id="default-search"
//             className="block w-full justify-center items-center p-4 pl-10 text-sm bg-gray-200 border-b-2 border-gray-500
// "
//             placeholder="Display iPhone..."
//             required
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           {/* <button
//             type="submit"
//             className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//           >
//             Buscar
//           </button> */}
//         </div>
//       </div>

//       {listaServicios ? (
//         <>
//           <h2 className="font-black text-3xl text-center">
//             Lista de Servicios
//           </h2>
//           <div className="text-lg mt-5 text-center mb-10">
//             Administra tus{" "}
//             <span className="text-orange-600 font-bold ">Servicios</span>
//           </div>
//           {listaServicios &&
//             filterLocal.map((item) => {
//               return (
//                 <>
//                   <Servicio
//                     key={item._id}
//                     item={item}
//                     setServiceEdit={setServiceEdit}
//                     serviceEdit={serviceEdit}
//                   />
//                 </>
//               );
//             })}
//         </>
//       ) : (
//         <>
//           <h2 className="font-black text-3xl text-center">No hay Servicios</h2>
//           <p className="text-lg mt-5 text-center mb-10">
//             Agregar tus{" "}
//             <span className="text-orange-700 font-bold ">Servicios</span>
//             <PacmanLoader
//               size={40}
//               color={"#cc6b03"}
//               aria-label="Loading Spinner"
//               data-testid="loader"
//             />
//           </p>
//         </>
//       )}
//     </div>
//   );
// };

export default ListaServicios;
