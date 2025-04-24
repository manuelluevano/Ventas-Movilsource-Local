import { useState } from "react";
import Error from "./Error";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const FormularioRegistro = () => {
  //CONTEXT
  const { mostrarAlerta, alerta, cargando, registerUser } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !surname || !email || !password) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });

      return;
    }

    //INCIAMOS SESION
    const response = await registerUser({ name, surname, email, password })

    console.log(response.status);
    if(response.status == "Success"){
        console.log("good");
        <Navigate to='/'/>
    }
}

  //EXTRAER ALERTA
  const { msg } = alerta;

  return (
    <>
      <form>
        <div className="mx-auto w-1/2 justify-center items-center ">
          <legend className="font-black text-5xl text-center mb-10">
            Registrarse
          </legend>
          {msg && <Error alerta={alerta} />}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block font-bold text-gray-700 uppercase"
            >
              Nombre:
            </label>
            <input
              id="name"
              type="text"
              disabled={cargando}
              className={`${
                msg ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100`}
              placeholder="ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="surname"
              className="block font-bold text-gray-700 uppercase"
            >
              apellido:
            </label>
            <input
              id="surname"
              type="text"
              disabled={cargando}
              className={`${
                msg ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100`}
              placeholder="ingresa tu apellido"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block font-bold text-gray-700 uppercase"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              disabled={cargando}
              className={`${
                msg ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100`}
              placeholder="ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block font-bold text-gray-700 uppercase"
            >
              password:
            </label>
            <input
              id="password"
              type="password"
              disabled={cargando}
              className={`${
                msg ? "border-red-400" : ""
              } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100`}
              placeholder="ingresa tu password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="submit"
              value={"Registrarse"}
              disabled={cargando}
              onClick={handleSubmit}
              className={
                cargando
                  ? "bg-sky-800 text-white p-3 font-bold uppercase flex w-full mt-5 justify-center rounded cursor-pointer transition-colors"
                  : "bg-sky-600 hover:bg-sky-700 text-white p-3 font-bold uppercase flex w-full mt-5 justify-center rounded cursor-pointer transition-colors"
              }
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default FormularioRegistro;
