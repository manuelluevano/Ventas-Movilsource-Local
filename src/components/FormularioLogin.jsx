import { useState } from "react";
import Error from "./Error";
import useAuth from "../hooks/useAuth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import { handleMessage } from "../helpers";
import Swal from "sweetalert2";

const FormularioLogin = () => {
  //CONTEXT
  const { mostrarAlerta, alerta, cargando, loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [btn, setBtn] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = (e) => {
    e.preventDefault();
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

   const handleSubmit = async (e) => {
     setBtn(false);
     e.preventDefault();

     if (!email || !password) {
       mostrarAlerta({
         msg: "Todos los campos son obligatorios",
         error: true,
       });
       setBtn(true);

       return;
     }

    //  INCIAMOS SESION
     const response = await loginUser({ email, password });

  console.log(response);

     if (response.status === "Success") {
       setBtn(true);
       Swal.fire({
        title: "Login Correcto!",
        text:`${response.mensaje} ${response.userSearch?.username} 🥳`,
        icon: "success"
      })
     }else if(response.status === "error"){
      setBtn(true);
      Swal.fire({
       title: "Error!",
       text:`${response.mensaje}`,
       icon: "error"
     })
     }



      console.log(response);
     toast.promise(handleMessage, {
       style: {
         color: "white",
       },
       loading: "Loading...",
       success: () => {
         return `${response.mensaje} ${response.userSearch.username} 🥳`;
       },
       error: () => {
         return `${response.mensaje}`;
       },
     }
    );

    

    //  CHARGIN
     setTimeout(async () => {
       if (response.status === "error") {
          console.log(response);
         mostrarAlerta({
           msg: response.mensaje,
           error: true,
         });

         return;
       }

      //  GUARDAMOS SESION EN LOCALSTORAGE
       localStorage.setItem("token", JSON.stringify(response.token));
       console.log("datos",response);
       
     }, 2000);
   };

  //EXTRAER ALERTA
  

  const { msg } = alerta;

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />
      <div>
        <form>
          <div className="mx-auto w-1/3 mt-10">
            <legend className="font-black text-5xl text-center mb-10">
              Iniciar Sesion
            </legend>

            {msg && <Error alerta={alerta} />}

            <div className="mb-5">
              <label
                className="block font-bold text-gray-700 uppercase"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                disabled={!btn}
                className={`${
                  msg ? "border-red-400" : ""
                } border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100
                
                ${!btn ? "opacity-30 bg-gray" : ""}
                `}
                placeholder="ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label
                className="relative mb-8  font-bold text-gray-700 uppercase"
                htmlFor="password"
              >
                password:
              </label>
              <div className="flex">
                <input
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  disabled={!btn}
                  className={`${
                    msg ? "border-red-400" : ""
                  } border-2 w-full p-2 mt-2 mb-4 placeholder-gray-400 rounded-md bg-gray-100
                pr-10 text-base 
                ${!btn ? "opacity-30 bg-gray" : ""}
                
                `}
                  placeholder="ingresa tu password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={togglePassword}>
                  {passwordShown ? (
                    <AiFillEye className="ml-1 text-2xl text-gray-400" />
                  ) : (
                    <AiFillEyeInvisible className="ml-1 text-2xl text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <input
              type="submit"
              value={"Login"}
              disabled={!btn}
              onClick={handleSubmit}
              className={
                !btn
                  ? "bg-sky-600 opacity-30 text-white p-3 font-bold uppercase flex w-full mt-5 justify-center rounded transition-colors"
                  : "bg-sky-600 hover:bg-sky-700 text-white p-3 font-bold uppercase flex w-full mt-5 justify-center rounded cursor-pointer transition-colors"
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default FormularioLogin;
