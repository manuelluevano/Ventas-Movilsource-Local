import { useEffect, useState } from "react";
//HELPERS
import { categorias, handleMessage } from "../helpers/index";
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

import Error from "./Error";
import { toast } from "sonner";
import { addAccesorio } from "../API/events";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
const FormularioAccesorio = () => {
  // const [accesorioEdit, setAccesorioEdit] = useState();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [precio_original, setPrecio_original] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [activo, setActivo] = useState(1);
  const [imagen, setImagen] = useState("");
  const [imagenPreviw, setImagenPreview] = useState(null);
  const [disable, setDisable] = useState(false);

  //OBTENR ID DE PRODUCTO
  const { id } = useParams();
  const navigate = useNavigate();

  //CONTEXT
  const { mostrarAlerta, alerta, setReload } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);

    //  VALIDATION
    if (!nombre ) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });

      return;
    }

    let response;
  
    response = await addAccesorio(nombre, descripcion, precio, precio_original, stock, categoria, activo, imagen);

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
    //  reiniciar el formulario
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoria("");
    setImagen("");
    setPrecio_original("")
    setImagenPreview(null);

    //  RECARGAR LA LISTA DE SERVICIOS
    setDisable(false);
    setReload(true);

    //IR A ACCESORIOS
    navigate('/accesorios');
  };
  //EXTRAER ALERTA
  const { msg } = alerta;

  //IMAGEN
  //CONVERT IMG TO BASE64
  async function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
  //MOSTRAR PREVIEW DE IMAGEN
  async function handleImageChange(e) {
    setImagenPreview(URL.createObjectURL(e.target.files[0]));

    const files = e.target.files;
    console.log(files.length);

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      // uploadSingleImage(base64);
      setImagen(base64);
      return;
    }

    const base64s = [];
    for (var i = 0; i < files.length; i++) {
      var base = await convertBase64(files[i]);
      base64s.push(base);
    }
  }

  function UploadInput() {
    return (
      <>
        {imagenPreviw ? (
          <div>
            <button
              className="w-8 h-8 rounded-full bg-gray-800 transition-colors hover:bg-red-500 text-white"
              onClick={() => {
                setImagen("");
                setImagenPreview("");
              }}
            >
              X
            </button>
            <img className="mx-auto w-80" src={imagenPreviw} alt="img" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click para subir </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                onChange={handleImageChange}
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
              />
            </label>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      {disable ? (
        <div className="">
          <div className="bg-white shadow-2xl rounded-lg py-10 px-5">
            <legend className="font-black text-3xl text-center mb-10">
              {id ? "Editando..." : "Guardando el Accesorio..."}
            </legend>

            {msg ? (
              <Error alerta={alerta} />
            ) : (
              <div className="text-center text-6xl">✅</div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-16 mx-auto lg:w-1/3 md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-lg py-10 px-5"
          >
            <legend className="font-black text-3xl text-center mb-10">
              {id ? "Edicion de Producto" : "Nuevo Accesorio"}
            </legend>
            {msg && <Error alerta={alerta} />}

            <div className="mb-5">
              <label
                htmlFor="nombre"
                className="block font-bold text-gray-700 uppercase"
              >
                Nombre Producto
              </label>
              <input
                id="nombre"
                type="text"
                className={`${
                  msg && !nombre ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
                value={nombre.toUpperCase()}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                disabled={disable}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="descripcion"
                className="block font-bold text-gray-700 uppercase"
              >
                Descripcion
              </label>
              <input
                id="descripcion"
                type="text"
                className={`${
                  msg && !descripcion ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
                value={descripcion.toUpperCase()}
                onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                disabled={disable}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="precio_original"
                className="block font-bold text-gray-700 uppercase"
              >
                precio original 
              </label>
              <input
                id="precio_original"
                type="number"
                maxLength="5"
                className={`${
                  msg && !precio_original ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
                value={precio_original}
                onChange={(e) => setPrecio_original(e.target.value)}
                disabled={disable}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="precio"
                className="block font-bold text-gray-700 uppercase"
              >
                Precio Publico
              </label>
              <input
                id="precio"
                type="number"
                maxLength="5"
                className={`${
                  msg && !precio ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                disabled={disable}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="stock"
                className="block font-bold text-gray-700 uppercase"
              >
                Stock / Cantidad
              </label>
              <input
                id="stock"
                type="number"
                maxLength="5"
                className={`${
                  msg && !stock ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={disable}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="categoria"
                className="block font-bold text-gray-700 uppercase"
              >
                Categoria
              </label>
              <Select
                id="categoria"
                className={`${
                  msg && !categorias ? "border-red-400 border-2" : ""
                } w-full  mt-2 placeholder-gray-400 rounded-md`}
                options={categorias}
                onChange={(e) => setCategoria(e.value)}
                defaultInputValue={""}
                placeholder="Cargadores..."
              />
            </div>
            {/* IMAGEN PREVIEW  */}
            <div className="mb-5">
              <div>
                <UploadInput />
              </div>
            </div> 
            

            <input
              type="submit"
              className="bg-green-700 w-full text-white uppercase font-bold p-3 hover:bg-green-800 cursor-pointer transition-colors"
              value={id ? "Editar" : "Agregar"}
              disabled={disable}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default FormularioAccesorio;
