import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/movilsource-no-fondo.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MdAccountCircle, MdExitToApp } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";

const Headers = () => {
  const { setTokenUser, tokenUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const cerrarSesion = async () => {
    localStorage.removeItem("token");
    setTokenUser({});
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-sm py-2 shadow-xl' : 'bg-gray-900 py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="MovilSource Logo" className="h-12 w-auto" />
            <span className="ml-3 text-xl font-bold text-white hidden md:block">MOVILSOURCE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {Object.keys(tokenUser).length > 0 ? (
              <>
                <div className="flex items-center space-x-6">
                  <Link
                    to="/perfil"
                    className={`flex items-center text-lg font-medium transition-colors ${location.pathname === "/perfil" ? "text-orange-400" : "text-gray-300 hover:text-white"}`}
                  >
                    <MdAccountCircle className="mr-2 text-2xl" />
                    {tokenUser && `${tokenUser.name} ${tokenUser.lastname}`}
                  </Link>
                  <button
                    onClick={cerrarSesion}
                    className="flex items-center text-lg font-medium text-gray-300 hover:text-red-400 transition-colors"
                    title="Cerrar sesión"
                  >
                    <MdExitToApp className="mr-2 text-2xl" />
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${location.pathname === "/login" ? "bg-orange-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"}`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${location.pathname === "/register" ? "bg-orange-500 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}`}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm px-4 py-3">
            {Object.keys(tokenUser).length > 0 ? (
              <div className="flex flex-col space-y-4">
                <Link
                  to="/perfil"
                  className={`flex items-center text-lg py-2 px-3 rounded-lg transition-colors ${location.pathname === "/perfil" ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdAccountCircle className="mr-3 text-2xl" />
                  {tokenUser && `${tokenUser.name} ${tokenUser.lastname}`}
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="flex items-center text-lg py-2 px-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors"
                >
                  <MdExitToApp className="mr-3 text-2xl" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className={`py-2 px-4 rounded-lg font-medium text-center transition-all ${location.pathname === "/login" ? "bg-orange-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className={`py-2 px-4 rounded-lg font-medium text-center transition-all ${location.pathname === "/register" ? "bg-orange-500 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20 md:pt-24"></div>
      
      <Outlet />
    </>
  );
};

export default Headers;