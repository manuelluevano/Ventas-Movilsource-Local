import { useState } from "react";
// eslint-disable-next-line react/prop-types
import Select from "react-select";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

//HELPERS
import {
  marcas,
  refacciones,
  calidades,
  handleMessage,
} from "../helpers/index";
import useAuth from "../hooks/useAuth";
import Error from "../components/Error";
import { Toaster, toast } from "sonner";
import { addNewRefaccion } from "../API/events";

export default function UploadImage() {
  // const params = useParams();

  const navigate = useNavigate();

  const [refaccion, setRefaccion] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [calidad, setCalidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagenPreviw, setImagenPreview] = useState(null);
  // const [refaccionEdit, setRefaccionEdit] = useState("");
  //CONTEXT
  const { mostrarAlerta, alerta } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Envio de datos");

    //VALIDATION
    if (
      !refaccion ||
      !modelo ||
      !marca ||
      !calidad ||
      !precio ||
      !stock ||
      !imagen
    ) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });

      return;
    }

    //ENVIAR DATOS A SERVER
    const response = await addNewRefaccion({
      refaccion,
      modelo,
      marca,
      calidad,
      precio,
      stock,
      imagen,
    });
    console.log(response);

    if (response) {
      if (response.status === "Error") {
        console.log(response);
        mostrarAlerta({
          msg: "Error " + response.mensaje,
          error: true,
        });

        return;
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

      if (response.status === "success") {
        //reiniciar el formulario
        setRefaccion("");
        setModelo("");
        setMarca("");
        setCalidad("");
        setPrecio("");
        setStock("");
        setImagen("");
        setImagenPreview(null);
      }
      //REGRESAR A REFACCIONES
      if (response.status === "success") {
        setTimeout(() => {
          navigate("/refacciones");
        }, 2000);
      }
    }
  }

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

  //EXTRAER ALERTA
  const { msg } = alerta;

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
            <img className="mx-auto w-40" src={imagenPreviw} alt="img" />
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

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   getInfoRefaccion();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // async function getInfoRefaccion() {
  //   const response = await getRefaccionID(params.id);
  //   setRefaccionEdit(response.refaccion);
  //   console.log(response.refaccion);
  // }

  // async function handleUpdate(e) {
  //   e.preventDefault();
  //   console.log("Envio de datos");

  //   //VALIDATION
  //   if (!refaccion || !modelo || !marca || !calidad || !precio || !stock) {
  //     mostrarAlerta({
  //       msg: "Todos los campos son obligatorios",
  //       error: true,
  //     });

  //     return;
  //   }

  //   //ENVIAR DATOS A SERVER
  //   const response = await addNewRefaccion({
  //     refaccion,
  //     modelo,
  //     marca,
  //     calidad,
  //     precio,
  //     stock,
  //   });
  //   console.log(response);

  //   if (response.status === "Error") {
  //     console.log(response);
  //     mostrarAlerta({
  //       msg: "Error " + response.mensaje,
  //       error: true,
  //     });

  //     return;
  //   }

  //   toast.promise(handleMessage, {
  //     style: {
  //       color: "white",
  //     },
  //     loading: "Loading...",
  //     success: () => {
  //       return `${response.mensaje}`;
  //     },
  //     error: "Error",
  //   });

  //   //REGRESAR A REFACCIONES
  //   setTimeout(() => {
  //     navigate("/refacciones");
  //   }, 4500);
  // }

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />
      {/* formulario refaqccion */}

      <div className="md:w-1/2 mx-auto lg:w-2/5 mb-10 mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-lg py-10 px-5"
        >
          <legend className="font-black text-3xl mt-5 text-center mb-10 text-gray-700">
            Registro de Refaccion
          </legend>
          {msg && <Error alerta={alerta} />}
          <div className="mb-5">
            <div
              htmlFor="refaccion"
              className="block font-bold text-gray-700 uppercase"
            >
              Tipo de refaccion
            </div>

            <Select
              id="refaccion"
              className={`${
                msg && !refaccion ? "border-red-400 border-2" : ""
              } w-full  mt-2 placeholder-gray-400 rounded-md`}
              options={refacciones}
              onChange={(e) => setRefaccion(e.value)}
              placeholder="Flex..."
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="modelo"
              className="block font-bold text-gray-700 uppercase"
            >
              modelo
            </label>
            <input
              id="modelo"
              type="text"
              className={`${
                msg && !modelo ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
              placeholder="12 PRO MAX "
              value={modelo.toUpperCase()}
              onChange={(e) => setModelo(e.target.value.toUpperCase())}
            />
          </div>

          <div className="mb-5">
            <div
              htmlFor="marca"
              className="block font-bold text-gray-700 uppercase"
            >
              Marca
            </div>

            <Select
              id="marca"
              className={`${
                msg && !marca ? "border-red-400 border-2" : ""
              } w-full  mt-2 placeholder-gray-400 rounded-md`}
              options={marcas}
              onChange={(e) => setMarca(e.value)}
              placeholder="Apple..."
            />
          </div>

          <div className="mb-5">
            <div
              htmlFor="calidad"
              className="block font-bold text-gray-700 uppercase"
            >
              Calidad
            </div>

            <Select
              id="calidad"
              className={`${
                msg && !calidad ? "border-red-400 border-2" : ""
              } w-full  mt-2 placeholder-gray-400 rounded-md`}
              options={calidades}
              onChange={(e) => setCalidad(e.value)}
              placeholder="Original..."
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="precio"
              className="block font-bold text-gray-700 uppercase"
            >
              Precio
            </label>
            <input
              id="precio"
              type="text"
              className={`${
                msg && !precio ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
              placeholder="$250"
              value={precio.toUpperCase()}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="stock"
              className="block font-bold text-gray-700 uppercase"
            >
              Stock
            </label>
            <input
              id="stock"
              type="text"
              className={`${
                msg && !stock ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md`}
              placeholder="3"
              value={stock.toUpperCase()}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* IMAGEN PREVIEW */}
          <div className="mb-5">
            <div>
              <h2
                className={`${
                  msg && !imagen ? "text-red-400 text-3xl" : ""
                } text-center  text-2xl  mb-5 font-extrabold p-2 mt-2 placeholder-gray-400 rounded-md`}
              >
                Agrega Imagen
              </h2>
            </div>

            <div>
              <UploadInput />
            </div>
          </div>

          <input
            type="submit"
            className="bg-green-700 w-full text-white uppercase font-bold p-3 hover:bg-green-800 cursor-pointer transition-colors"
            value={"Agregar"}
          />
        </form>
      </div>
    </>
  );
}
