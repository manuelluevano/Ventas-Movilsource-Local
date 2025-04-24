/* eslint-disable react-refresh/only-export-components */

import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/movilsource-no-fondo.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MdAccountCircle, MdExitToApp } from "react-icons/md";
// import { useLoaderData } from "react-router-dom";
// import { precioDolar } from "../API/events";

const local = 0;

// export async function loader() {
//   // MULTIPLES CONSULTAS SIMULTANEAS

//   // const [precio1, precio2] = await Promise.all([precioDolar(), precioDolar()]);

//   // const data = {
//   //   precio1,
//   //   precio2,
//   // };

//   // return data;
// }

const Headers = () => {
  const { setTokenUser, tokenUser } = useAuth();
  // let datos = useLoaderData();

  const navigate = useNavigate();

  const location = useLocation();

  const cerrarSesion = async () => {
    localStorage.removeItem("token");
    setTokenUser({});
  };

  return (
    <>
      <header className=" bg-black">
        <div className="md:flex md:justify-between items-center ml-10 mr-10">
          <Link onClick={() => navigate("/")}>
            <img src={logo} width={80} />
          </Link>

          {Object.keys(tokenUser).length === 0  ? (
            <nav className="p-3 ml-5 ">
              {/* <p className="mr-5 p-2 bg-orange-600 font-bold rounded-md uppercase text-white">
                {location.pathname === "/login" ? (
                  <Link
                    className={`${
                      location.pathname === "/register"
                        ? "bg-orange-600"
                        : "bg-orange-600"
                    } `}
                    to="/register"
                  >
                    Registro
                  </Link>
                ) : (
                  <Link
                    className={`${
                      location.pathname === "/login"
                        ? "bg-orange-600"
                        : "bg-orange-600"
                    } `}
                    to="/login"
                  >
                    iniciar sesion
                  </Link>
                )}
              </p> */}
              {Object.keys(tokenUser).length !== 0 && local === 0 ? (
                <button
                  onClick={cerrarSesion}
                  className={`uppercase mr-2 text-3xl text-white hover:text-red-500 rounded cursor-pointe transition-colors`}
                >
                  <MdExitToApp />
                </button>
              ) : (
                ""
              )}
            </nav>
          ) : (
            <>
              <nav className="md:flex sm:text-center  items-center gap-10">
              {/* <Link
                  className={`${
                    location.pathname === "/servicios"
                      ? "text-orange-500"
                      : "text-white"
                  } uppercase cursor-pointe transition-colors`}
                  to="/servicios"
                >
                  Servicios
                </Link> */}
                  {/* 
                <Link
                  className={`${
                    location.pathname === "/refacciones"
                      ? "text-orange-600"
                      : "text-white"
                  } uppercase cursor-pointe transition-colors`}
                  to="/refacciones"
                >
                  Refacciones
                </Link> */}
                {/* <Link
                  className={`${
                    location.pathname === "/accesorios"
                      ? "text-orange-600"
                      : "text-white"
                  } uppercase cursor-pointe transition-colors`}
                  to="/accesorios"
                >
                  Accesorios
                </Link>
                <Link
                  className={`${
                    location.pathname === "/servicios"
                      ? "text-orange-600"
                      : "text-white"
                  } uppercase cursor-pointe transition-colors`}
                  to="/servicios"
                >
                  Servicios
                </Link> */}

                {
                  <div className=" text-green-500">
                    {/* {datos && datos.precio1.base + datos.precio1.rates.MXN} */}
                  </div>
                }
                <div className="flex items-center">
                  <Link
                    to="/perfil"
                    className={`${
                      location.pathname === "/perfil"
                        ? "text-orange-600"
                        : "text-white"
                    } uppercase mr-2 text-3xl rounded cursor-pointe transition-colors`}
                  >
                    <MdAccountCircle />
                  </Link>
                  <p className="text-white  uppercase">
                    {tokenUser && tokenUser.name + " " + tokenUser.lastname}
                  </p>
                </div>
                <button
                  onClick={cerrarSesion}
                  className={`uppercase mr-2 text-3xl text-white hover:text-red-500 rounded cursor-pointe transition-colors`}
                >
                  <MdExitToApp />
                </button>
              </nav>
            </>
          )}
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Headers;

//ACTUALIZADO
