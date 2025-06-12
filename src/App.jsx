import { Link, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { Toaster } from "sonner";
import { PiHeadphonesDuotone } from "react-icons/pi";
import { VscTools } from "react-icons/vsc";
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";

function App() {
  const { tokenUser } = useAuth();

  // Opciones de menú con iconos y colores
  const menuItems = [
    {
      path: "/accesorios",
      icon: <PiHeadphonesDuotone className="text-7xl" />,
      title: "ACCESORIOS",
      color: "bg-blue-100 hover:bg-blue-200 text-blue-800"
    },
    {
      path: "/servicios",
      icon: <VscTools className="text-7xl" />,
      title: "SERVICIOS",
      color: "bg-green-100 hover:bg-green-200 text-green-800"
    },
    {
      path: "/pendientes",
      icon: <MdOutlineInventory className="text-7xl" />,
      title: "PENDIENTES",
      color: "bg-amber-100 hover:bg-amber-200 text-amber-800"
    },
    {
      path: "/administrador",
      icon: <AiOutlineAppstore className="text-7xl" />,
      title: "ADMINISTRADOR",
      color: "bg-purple-100 hover:bg-purple-200 text-purple-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#4CAF50", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />

      {tokenUser.id ? (
        <div className="container mx-auto px-4 py-8">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
            <p className="text-gray-600 mt-2">Bienvenido, selecciona una opción</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {menuItems.map((item, index) => (
              <Link 
                to={item.path} 
                key={index}
                className={`${item.color} rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center h-full transform hover:-translate-y-1`}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </Link>
            ))}
          </div>

          <footer className="mt-16 text-center text-gray-500 text-sm">
            <p>Sistema de Gestión © {new Date().getFullYear()}</p>
          </footer>
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
}

export default App;