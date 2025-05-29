import { FaPlusCircle } from "react-icons/fa";
import { Link, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVentasXFecha, listAccesorios } from "../API/events";

import '../assets/ReporteVentas.css'; // Estilos opcionales
import Exhibidor from "../components/Exhibidor";

const Administrador = () => {
  // const [adminSelect, setAdminSelect] = useState();
  // const [list, setList] = useState();
  // const [ventas, setVentas] = useState([]);
  // const [fechaInicio, setFechaInicio] = useState('');
  // const [fechaFin, setFechaFin] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');


  // useEffect(() => {
  //   (async () => {
  //     const response = await listAccesorios();
  //     setList(response.accesorios);
  //   })();
  // }, [adminSelect]);


  // const generarReporte = async () => {
  //   if (!fechaInicio || !fechaFin) {
  //     setError('Debe seleccionar ambas fechas');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await getVentasXFecha( fechaInicio, fechaFin );
  //     setVentas(response.ventas);
  //     console.log(response);
      
  //   } catch (err) {
  //     setError('Error al obtener el reporte de ventas');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const calcularTotales = () => {
  //   const totalVentas = ventas?.length;
  //   // const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);
  //   // const promedio = totalVentas > 0 ? totalMonto / totalVentas : 0;

  //   return { totalVentas}
  // };

  // const { totalVentas, totalMonto, promedio } = calcularTotales();



  // const rendered = ({minutes, seconds})=>{
  //   console.log(minutes);
    
  //   return (
  //     <h2>{minutes + seconds}</h2>
  //   )
  //    }

  return (

    // <div className="container mx-auto">
    //   {/* <div className="mt-3">
    //     {adminSelect ? (
    //       <div className="mt-10">
    //         <h2 className="text-2xl font-medium text-center text-cyan-600">
    //           Accesorios
    //         </h2>
    //         <Link
    //           to="/FormularioAccesorio"
    //           type="button"
    //           className="items-center py=2 p-3 mt-5 font-semibold text-white bg-green-500 hover:bg-green-600 hover:text-white  rounded-lg"
    //         >
    //           <FaPlusCircle className="mr-2 text-xl" />
    //           Agregar Nuevo
    //         </Link>

    //         <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
    //           <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    //             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //               <tr>
    //                 <th scope="col" className="px-16 py-3">
    //                   Imagen
    //                 </th>
    //                 <th scope="col" className="px-6 py-3">
    //                   Producto
    //                 </th>
    //                 <th scope="col" className="px-6 py-3">
    //                   Stock
    //                 </th>
    //                 <th scope="col" className="px-6 py-3">
    //                   Precio
    //                 </th>
    //                 <th scope="col" className="px-6 py-3">
    //                   Action
    //                 </th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {list?.map((item) => {
    //                 return (
    //                   <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
    //                     <td className="p-4">
    //                       <img
    //                         className="w-20 "
    //                         src={`${item.imagen}`}
    //                         alt="Imagen no disponible"
    //                       />
    //                     </td>
    //                     <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
    //                       {item.nombre}
    //                     </td>
    //                     <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
    //                       {item.stock}
    //                     </td>
    //                     <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
    //                       ${item.precio}
    //                     </td>
    //                     <td className="px-6 py-4">
    //                       <Link
    //                         className="font-medium text-green-600 dark:text-green-500 hover:underline"
    //                         to={{
    //                           pathname: `/FormularioAccesorio/${item._id}`,
    //                         }}
    //                       >
    //                         Editar
    //                       </Link>
    //                     </td>
    //                   </tr>
    //                 );
    //               })}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     ) : (
    //       <div>
    //         <div className="mt-10">

    //           <div className="reporte-container">
    //   <h2>Reporte de Ventas</h2>
      
    //   <div className="filtros">
    //     <label>
    //       Fecha Inicio:
    //       <input 
    //         type="date" 
    //         value={fechaInicio}
    //         onChange={(e) => setFechaInicio(e.target.value)}
    //       />
    //     </label>
        
    //     <label>
    //       Fecha Fin:
    //       <input 
    //         type="date" 
    //         value={fechaFin}
    //         onChange={(e) => setFechaFin(e.target.value)}
    //       />
    //     </label>
        
    //     <button onClick={generarReporte} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center">
    //         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    //         </svg>
    //         {loading ? 'Generando...' : 'Generar Reporte'}
    //     </button>
    //   </div>

    //   {error && <p className="error">{error}</p>}

    //   <div className="resumen">
    //     <h3>Resumen</h3>
    //     {/* <p>Total Ventas: {totalVentas}</p>
    //     <p>Monto Total: ${totalMonto.toFixed(2)}</p>
    //     <p>Promedio por Venta: ${promedio.toFixed(2)}</p> */}
    //   </div>

    //   <div className="tabla-ventas">
    //     <h3>Detalle de Ventas</h3>
    //     {ventas?.length > 0 ? (
    //       <table>
    //         <thead>
    //           <tr>
    //             <th>ID</th>
    //             <th>Fecha</th>
    //             <th>Vendedor</th>
    //             <th>Producto</th>
    //             <th>Metodo Pago</th>
    //             <th>Comentarios</th>
    //             <th>Total</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {ventas.map((venta) => (
    //             <tr key={venta.id}>
    //               <td>{venta.id}</td>
    //               <td>{new Date(venta.fecha_pedido).toLocaleDateString()}</td>
    //               <td>{venta.id_vendedor}</td>
    //               <td>{venta.detalles}</td>
    //               <td>{venta.metodo_pago}</td>
    //               <td>{venta.comentarios}</td>
    //               <td>${venta.total}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     ) : (
    //       <p>No hay datos de ventas para el período seleccionado</p>
    //     )}
    //   </div>
    // </div>
    //         </div>
    //       </div>
    //     )}
    //   </div> */}
    // </div>
  
  <Exhibidor/>

  );
};

export default Administrador;
