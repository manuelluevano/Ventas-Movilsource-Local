/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdModeEdit } from "react-icons/md";

const User = ({ tokenUser }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  async function handleTerminar() {}

  return (
    <>
      <div className="mx-auto w-1/3 text-center mt-10">
        <div className="bg-gray-300 text-black shadow-2xl rounded-lg py-10 px-5">
          <h2 className="mb-10 text-5xl">Mis Datos</h2>

          <div className="">
            <div className="flex items-center justify-around mb-10">
              <span className="uppercase mr-3 font-bold">Nombre:</span>
              <input
                className="text-black border-2  p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100"
                type="text"
                value={name ? name : tokenUser.name}
                onChange={(e) => setName(e.target.value)}
              />
              <MdModeEdit className="text-2xl" />
            </div>
            <div className="flex items-center justify-around mb-10">
              <span className="uppercase mr-3 font-bold">Apellido:</span>
              <input
                className="text-black border-2 p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100"
                type="text"
                value={surname ? surname : tokenUser.surname}
                onChange={(e) => setSurname(e.target.value)}
              />

              <MdModeEdit className="text-2xl" />
            </div>
            {/* <div className="flex items-center justify-around">
              <span className="uppercase mr-3 font-bold">Email:</span>
              <input
                className="text-black border-2 p-2 mt-2 placeholder-gray-400 rounded-md bg-gray-100"
                type="text"
                value={email ? email : tokenUser.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdModeEdit className="text-2xl" />
            </div> */}
            <button
              // disabled={item.status}
              type="button"
              className="mt-10 py-2 px-5 border-2 border-gray-600 hover:bg-green-600 hover:text-white hover:border-green-600 font-bold uppercase rounded-lg"
              onClick={() => handleTerminar()}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
