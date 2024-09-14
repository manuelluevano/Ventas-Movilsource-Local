import { useEffect, useState } from "react";
import { addPendiente, listPendientes, pendientTerminado } from "../API/events";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { formatearFecha, handleMessage } from "../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Pendientes = () => {
  const [listaPendientes, setListaPendientes] = useState([]);
  const [hide, setHide] = useState(false);
  const [pendiente, setPendiente] = useState("");
  const [detalle, setDetalle] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dia, setDia] = useState(new Date());
  const [status] = useState(false);

 

  //OBTENE LISTA DE PENDIENTES
  useEffect(() => {
    (async () => {
      const response = await listPendientes();
      // console.log("Respuesta refacciones", response);
      setListaPendientes(response);
      console.log("Lista de Pendientes", response);

      //REGRESAR RELOAD A ESTADO NORMAL
    })();
  }, []);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    console.log(dia);

    //CONVERTIR DIA SELECCIONADO EN FORMATO DATE()
    const diaConverter = new Date(dia);

    console.log(diaConverter);

    //   VALIDATION
     if ((!pendiente, !detalle, !telefono, !dia)) {
       mostrarAlerta({
         msg: "Todos los campos son obligatorios",
         error: true,
       });

       return;
     }

     const response = await addPendiente(pendiente, detalle, telefono, diaConverter, status);

     console.log(response);

     if (response.status === "success") {
       Swal.fire({
         title: `${response.status}`,
         text: `${response.mensaje} 🥳`,
         icon: "success",
       });
     } else {
       Swal.fire({
         title: `${response.status}`,
         text: `${response.mensaje}`,
         icon: "error",
       });
     }

     if (response.status === "Error") {
       console.log(response);
       mostrarAlerta({
         msg: "Error " + response.mensaje,
         error: true,
       });
     }
     toast.promise(handleMessage, {
       style: {
         color: "white",
       },
       loading: "Loading...",
       success: () => {
         return `${response.mensaje}`;
       },
       error: "Error",
     });
  };

  const handleChangeStatus = async (id) => {
    console.log(id);

    let response;

    const confirm = window.confirm("Pendiente Realizado Correctamente?");

    if (confirm) {
      response = await pendientTerminado(id);

      // console.log(response);

      if (response.status === "Success") {
        Swal.fire({
          title: `${response.status}`,
          text: `${response.message} 🥳`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: `${response.status}`,
          text: `${response.message}`,
          icon: "error",
        });
      }

      // if (response.status === "Error") {
      //   console.log(response);
      //   mostrarAlerta({
      //     msg: "Error " + response.mensaje,
      //     error: true,
      //   });
      // }
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

      setTimeout(() => {
        //RECARGAR PAGINA
        window.location.reload();
      }, 2000);
    }
  };



  return (
    <>
      {listaPendientes && (
        <div>
          <form>
            <div className="mx-auto w-1/3 mt-16">
              <legend className="font-black text-4xl text-center mb-10 mt-5">
                Lista Pendientes
              </legend>

              <div className="flex justify-between mt-16 font-bold">
                <h2>
                  N. Pendientes:{" "}
                  <span className="font-extrabold text-2xl ml-2 text-orange-400">
                    {listaPendientes.contador}
                  </span>
                </h2>
                <h2>
                  No Completados:{" "}
                  <span className="font-extrabold text-2xl ml-2 text-red-600">
                    {listaPendientes.pendientesNoTerminados}
                  </span>
                </h2>
                <h2>
                  Realizados:{" "}
                  <span className="font-extrabold text-2xl ml-2 text-green-600">
                    {listaPendientes.pendientesRealizados}
                  </span>
                </h2>
              </div>

              {/* AGREEGAR NUEVO PENDIENTE */}

              <div className="mt-10">
                <input
                  type="submit"
                  value={"Agregar"}
                  //   disabled={!btn}
                  onClick={() => setHide(!hide)}
                  className={
                    "bg-sky-600 cursor-pointer  text-white p-3 font-bold uppercase flex w-full justify-center rounded-3xl transition-colors"
                  }
                />
              </div>

              {hide ? (
                <div className="mt-10">
                  <label
                    htmlFor="pendiente"
                    className="block border-gray-300  border-2mb-2 text-sm font-bold text-blue-900"
                  >
                    Pendiente:
                  </label>

                  <input
                    type="text"
                    id="pendiente"
                    // disabled={!btn}
                    className={
                      "border-2 w-full  border-gray-300 p-2 mt-2 placeholder-gray-400 rounded-md"
                    }
                    placeholder="Mica Hidroguel..."
                    value={pendiente.toUpperCase()}
                    onChange={(e) => setPendiente(e.target.value)}
                  />
                  <label
                    htmlFor="detalle"
                    className="block mb-2 text-sm font-bold text-blue-900  mt-5"
                  >
                    Detalle:
                  </label>

                  <input
                    type="text"
                    id="detalle"
                    // disabled={!btn}
                    className={
                      "border-2 w-full  border-gray-300 p-2 mt-2 placeholder-gray-400 rounded-md"
                    }
                    placeholder="Detalles del pendiente"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                  />
                  <label
                    htmlFor="telefono"
                    className="block mb-2 text-sm font-bold text-blue-900  mt-5"
                  >
                    Telefono:
                  </label>

                  <input
                    type="Number"
                    id="telefono"
                    // disabled={!btn}
                    maxLength={8}
                    className={
                      "border-2 w-full  border-gray-300 p-2 mt-2 placeholder-gray-400 rounded-md"
                    }
                    placeholder="Telefono cliente"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                  <label
                    htmlFor="dia"
                    className="block mb-2 text-sm font-bold text-blue-900  mt-5"
                  >
                    Dia Para Entregar:
                  </label>

                  {/* <input
                    type="date"
                    id="dia"
                    // disabled={!btn}
                    className={
                      "border-2 w-full  border-gray-300 p-2 mt-2 placeholder-gray-400 rounded-md"
                    }
                    placeholder="Mica Hidroguel..."
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                  /> */}

                  <DatePicker  
                  selected={dia}
                   onChange={(e) => setDia(e)} />

                  <div className="flex justify-end">
                    <input
                      type="submit"
                      value={"Guardar"}
                      //   disabled={!btn}
                      onClick={handleSubmit}
                      className={
                        "bg-green-800 mt-5  text-white p-2 rounded-lg cursor-pointer   w-auto   transition-colors"
                      }
                    />
                  </div>
                  
                </div>
              ) : (
                ""
              )}
            </div>
          </form>

          <table className="mt-10 mx-auto">
            <tr>
              <th className=" px-6 py-4">PENDIENTE</th>
              <th className=" px-6 py-4">DETALLE</th>
              <th className=" px-6 py-4">DIA ENTREGA</th>
              <th className=" px-6 py-4">TELEFONO</th>
              <th className=" px-6 py-4">ESTADO</th>
            </tr>

            {listaPendientes.listPendientes?.map((i) => {
              // console.log(i.pendiente);
              return (
                <>
                  <tr className="border-solid border-2 ">
                    <td className="border-solid border-2 border-gray-300 px-2 py-3">
                      {i.pendiente}
                    </td>
                    <td className="border-solid border-2 border-gray-300 px-2 py-3">
                      {i.detalle}
                    </td>
                    <td className="border-solid border-2 border-gray-300 px-2 py-3">
                      {formatearFecha(i.dia)}
                    </td>
                    <td className="border-solid border-2 border-gray-300 px-2 py-3">
                      {i.telefono}
                    </td>
                    <td className=" px-6 py-4 justify-center flex">
                      <input
                        onChange={() => handleChangeStatus(i._id)}
                        checked={i.status}
                        id="green-checkbox"
                        type="checkbox"
                        className="px-6 py-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
      )}
    </>
  );
};

export default Pendientes;
