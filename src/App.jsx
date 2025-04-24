import { Link, Navigate } from "react-router-dom";

import useAuth from "./hooks/useAuth";
import { Toaster } from "sonner";
import { PiHeadphonesDuotone } from "react-icons/pi";
import { VscTools } from "react-icons/vsc";
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";
import { MdOutlinePhoneAndroid } from "react-icons/md";


// import logo from "./assets/banner.webp";

// import { useLoaderData } from "react-router-dom";

// export async function loader(){

//   // MULTIPLES CONSULTAS SIMULTANEAS

// const [precio1, precio2] = await Promise.all([
//   precioDolar(),
//   precioDolar()
// ])

// const data = {
//   precio1, precio2
// }

//   return data
// }

function App() {
  const { tokenUser } = useAuth();

  console.log(tokenUser.role);
  // const datos = useLoaderData();

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />

      {tokenUser.id ? (
        /* ICONOS DE ACCESO */
        <div className="container mx-auto flex ">
          <div className="mt-10 flex-wrap justify-between flex w-1/2 mx-auto text-center">
            <div className="cursor-pointer mt-40 p-4">
              <Link to="/accesorios">
                <PiHeadphonesDuotone className="text-9xl hover:p-1 transition-all" />
                <h3 className="mt-3 font-semibold">ACCESORIOS</h3>
              </Link>
            </div>
            <div className="cursor-pointer mt-40 p-4">
              <Link to="/servicios">
                <VscTools className="text-9xl hover:p-1 transition-all" />
                <h3 className="mt-3 font-semibold">SERVICIOS </h3>
              </Link>
            </div>
            
             <div className="cursor-pointer mt-40 p-4">
             <Link to="/pendientes">

              <MdOutlineInventory className="text-9xl hover:p-1 transition-all" />
              <h3 className="mt-3 font-semibold">PENDIENTES</h3>
              </Link>
            </div>
            <div className="cursor-pointer mt-40 p-4">
              <Link to="/administrador">
                <AiOutlineAppstore className="text-9xl hover:p-1 transition-all" />
                <h3 className="mt-3 font-semibold">ADMINISTRADOR</h3>
              </Link>
            </div> 
             {/*
            <div className="cursor-pointer mt-40 p-4">
              <Link to="/equipos">
                <MdOutlinePhoneAndroid className="text-9xl hover:p-1 transition-all" />
                <h3 className="mt-3 font-semibold">VENTA DE EQUIPOS</h3>
              </Link>
            </div>  */}
          </div>
        </div>
      ) : (
        <Navigate to="/login" />
      )}

    </>
  );
}

export default App;
