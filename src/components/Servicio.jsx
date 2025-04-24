/* eslint-disable react/prop-types */
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import { formatearFecha, handleMessage, marcas, servicios } from "../helpers";
import { useState } from "react";
import { updateService } from "../API/events";
import Select from "react-select";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
import Swal from "sweetalert2";

const Servicio = ({ item }) => {
  const {
    servicio,
    name,
    apellido,
    modelo,
    marca,
    imei,
    sn,
    telefono,
    precio,
    abono,
    created_at,
    folio,
    gaveta,
    status,
    complete,
    observaciones,
  } = item;

  const {
    EquipoTerminado,
    EquipoEntregado,
    setReload,
    reload,
    mostrarAlerta,
    tokenUser,
  } = useAuth();

  const [edit, setEdit] = useState(false);
  const [nameNew, setName] = useState("");
  const [telefonoNew, setTelefono] = useState("");
  const [servicioNew, setServicio] = useState("");
  const [modeloNew, setModelo] = useState("");
  const [marcaNew, setMarca] = useState("");
  const [imeiNew, setImei] = useState("");
  const [snNew, setSN] = useState("");
  const [precioNew, setPrecio] = useState("");
  const [abonoNew, setAbono] = useState("");
  const [folioNew, setFolio] = useState("");
  const [observacionesNew, setObservaciones] = useState("");

  {
    const handleTerminar = async (item) => {
      console.log(item);
      const { _id } = item;
      console.log("term", _id);
      const confirm = window.confirm("SE ENTREGO EL EQUIPO?");

      if (confirm) {
        //   //CHANGE SERVICE STATUS
        const response = await EquipoEntregado(_id);

        console.log("Respuesta del status", response);

        if (response.status === "Success") {
          Swal.fire({
            title: "Entrega a cliente...",
            text: `${response.message}`,
            icon: "success",
          });
        } else if (response.status === "error") {
          Swal.fire({
            title: "Error!",
            text: `${response.mensaje}`,
            icon: "error",
          });
        }

        //RECARGAR LA LISTA DE SERVICIOS
        setReload(true);
      }
    };

    // const handleEdit = async () => {
    //   setEdit(true);
    //   setName(name);
    //   setTelefono(telefono);
    //   setMarca(marca);
    //   setModelo(modelo);
    //   setImei(imeiNew);
    //   setSN(snNew);
    //   setServicio(servicio);
    //   setPrecio(precio);
    //   setFolio(folio);
    //   setObservaciones(observaciones);
    //   setAbono(abono);
    // };

    // const handleUpdate = async (item) => {
    //   const { _id } = item;
    //   console.log("Update", _id);
    //   const confirm = window.confirm("Actualizar");

    //   if (confirm) {
    //     const objterminado = {
    //       nameNew,
    //       telefonoNew,
    //       marcaNew,
    //       modeloNew,
    //       servicioNew,
    //       imeiNew,
    //       snNew,
    //       precioNew,
    //       folioNew,
    //       observacionesNew,
    //       abonoNew,
    //     };

    //     console.log("Objeto Terminado", objterminado);

    //     //ENVIAR LA ACTUALIZACION
    //     const response = await updateService(_id, objterminado);

    //     console.log("Respuiesta", response);
    //     if (response.status === "Error") {
    //       console.log(response);
    //       mostrarAlerta({
    //         msg: "Error " + response.mensaje,
    //         error: true,
    //       });

    //       return;
    //     }

    //     toast.promise(handleMessage, {
    //       style: {
    //         color: "white",
    //       },
    //       loading: "Loading...",
    //       success: () => {
    //         return `${response.mensaje}`;
    //       },
    //       error: "Error",
    //     });
    //   }

    //   //REGRESAR A EDIT FALSE
    //   setEdit(false);
    //   //RECARGAR LA LISTA DE SERVICIOS
    //   setReload(true);
    // };

    // const handleCancelar = async (id) => {
    //   console.log(id);
    // };

    const hanldeCompleteService = async (item) => {
      console.log(item);
      const { _id } = item;
      console.log("term", _id);

      const confirm = window.confirm("Se realizo la reparacion con exito?");

      if (confirm) {
        //   //CHANGE SERVICE STATUS
        const response = await EquipoTerminado(_id);

        console.log("Respuesta del status", response);

        if (response.status === "Success") {
          // setBtn(true);
          Swal.fire({
            //  title: "Reparacion Terminada!",
            text: `${response.message}  🥳`,
            icon: "success",
          });
        } else if (response.status === "error") {
          //  setBtn(true);
          Swal.fire({
            title: "Error!",
            text: `${response.mensaje}`,
            icon: "error",
          });
        }

        //RECARGAR LA LISTA DE SERVICIOS
        setReload(true);
      }
    };

    return (
      <>
        {item && (
          <div
            className={`${
              reload ? "bg-gray-100" : ""
            }  shadow-md  rounded-xl border-2 w-full border-gray-300 p-5 mt-2 placeholder-gray-800  hover:bg-slate-100`}
          >
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Nombre: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={nameNew.toUpperCase()}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                  />
                ) : (
                  name
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Apellido: {""}
              <span className="font-normal normal-case">{apellido ?? ""}</span>
            </div>
            <div className="flex font-bold mb-3 text-gray-700 uppercase">
              Telefono: {""}
              <span className="ml-1 font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={telefonoNew.toUpperCase()}
                    onChange={(e) => setTelefono(e.target.value.toUpperCase())}
                  />
                ) : (
                  <div className="flex text-gray-600 font-bold text-center items-center">
                    <Link
                      className=" hover:bg-slate-100"
                      to={`https://wa.me/${telefono}?text=Buen%20día%20su%20${modelo}%20esta%20listo%20para%20su%20entrega.`}
                      target="_blank"
                    >
                      {telefono}
                    </Link>
                    <FaWhatsapp className="text-green-700 ml-2" />
                  </div>
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Marca: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <Select
                    id="marca"
                    className={`
               w-full  mt-2 placeholder-gray-400 rounded-md`}
                    options={marcas}
                    onChange={(e) => setMarca(e.value)}
                    placeholder="Apple..."
                  />
                ) : (
                  marca
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Modelo: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={modeloNew.toUpperCase()}
                    onChange={(e) => setModelo(e.target.value.toUpperCase())}
                  />
                ) : (
                  modelo
                )}
              </span>
            </div>

            {imei ? (
              <div className="font-bold mb-3 text-gray-700 uppercase">
                IMEI: {""}
                <span className="font-normal normal-case">
                  {edit ? (
                    <input
                      type="text"
                      value={imeiNew.toUpperCase()}
                      onChange={(e) => setImei(e.target.value.toUpperCase())}
                    />
                  ) : (
                    imei
                  )}
                </span>
              </div>
            ) : (
              ""
            )}

            {sn ? (
              <div className="font-bold mb-3 text-gray-700 uppercase">
                SN: {""}
                <span className="font-normal normal-case">
                  {edit ? (
                    <input
                      type="text"
                      value={snNew.toUpperCase()}
                      onChange={(e) => setSN(e.target.value.toUpperCase())}
                    />
                  ) : (
                    sn
                  )}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="font-bold mb-3 text-gray-700 uppercase">
              Servicio: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <Select
                    id="servicio"
                    className={`
               w-full  mt-2 placeholder-gray-400 rounded-md`}
                    options={servicios}
                    onChange={(e) => setServicio(e.value)}
                  />
                ) : (
                  servicio
                )}
              </span>
            </div>

            <div className="font-bold mb-3 text-gray-700 uppercase">
              Precio Servicio: ${""}
              <span className="font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={precioNew}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                ) : (
                  precio
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Abono Servicio: ${""}
              <span className="font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={abonoNew}
                    onChange={(e) => setAbono(e.target.value)}
                  />
                ) : (
                  abono
                )}
              </span>
            </div>

            <div className="font-bold mb-3 text-gray-700 uppercase">
              Folio: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <input
                    type="text"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                  />
                ) : (
                  folio
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Gaveta: {""}
              <span className="font-normal normal-case">
                <input
                  type="text"
                  value={gaveta}
                  onChange={(e) => setGaveta(e.target.value)}
                />
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Observaciones: {""}
              <span className="font-normal normal-case">
                {edit ? (
                  <textarea
                    id="observaciones"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={observacionesNew.toUpperCase()}
                    onChange={(e) =>
                      setObservaciones(e.target.value.toUpperCase())
                    }
                  />
                ) : (
                  <textarea
                    className="w-full mt-2"
                    value={observaciones}
                    disabled
                  ></textarea>
                )}
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Fecha: {""}
              <span className="font-normal normal-case ml-1">
                {formatearFecha(created_at).toUpperCase()}
                {console.log(created_at)
                }
              </span>
            </div>
            <div className="font-bold mb-3 text-gray-700 uppercase">
              Tecnico:{" "}
              {tokenUser.name ? (
                <span className={"text-blue-700 "}>
                  {tokenUser.name + " " + tokenUser.lastname}
                </span>
              ) : (
                ""
              )}
            </div>

            {/* {!user.email ?  "desconocido" :  user.email } */}
            {/* {user.email && (
                user.email
              )} */}

            {/* </div>  */}
            <div className="flex">
              <div className="font-bold  text-gray-700 uppercase">ESTADO: </div>
              <div className="result">
                {complete === true ? (
                  <div>
                    <h1 className="text-green-700 font-extrabold normal-case ml-2 ">
                      Reparacion Realizada <span className="ml-1">✅</span>
                    </h1>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-red-700 font-extrabold normal-case ml-2 ">
                      Equipo No Reparado ❌
                    </h1>
                  </div>
                )}
              </div>
              {!complete && (
                <div className="topping ml-5">
                  <input
                    type="checkbox"
                    id="topping"
                    name="topping"
                    value=""
                    disabled={complete}
                    checked={complete}
                    onChange={() => hanldeCompleteService(item)}
                  />
                  <span className="ml-1 font-medium">Se Ha Terminado?</span>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-5">
              {/* {edit ? (
                <button
                  type="button"
                  // disabled
                  className="py-2 px-10 border-2 border-green-600 hover:bg-green-600 hover:text-white font-bold uppercase rounded-lg"
                  onClick={() => handleUpdate(item)}
                >
                  Guardar
                </button>
              ) : (
                <button
                disabled
                  type="button"
                  className="py-2 px-10 border-2 border-green-600 text-black hover:bg-green-600  hover:text-white font-bold uppercase rounded-lg"
                  onClick={() => handleEdit()}
                >
                  Editar
                </button>
              )} */}

              {/* {!item.status && (
                <button
                  className="py-2 px-10 border-2 border-red-600 text-black hover:bg-red-600  hover:text-white font-bold uppercase rounded-lg"
                  onClick={() => handleCancelar(item)}
                >
                  Cancelar Servicio
                </button>
              )} */}

              {edit ? (
                ""
              ) : (
                <button
                  disabled={item.status}
                  type="button"
                  className={
                    item.status
                      ? ""
                      : "py-2 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase rounded-lg"
                  }
                  onClick={() => handleTerminar(item)}
                >
                  {item.status ? (
                    <div className="text-2xl ">✔️ENTREGADO A CLIENTE</div>
                  ) : (
                    "ENTREGAR A CLIENTE"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
};

export default Servicio;
