import { useState } from "react";
import { Toaster, toast } from "sonner";
import { IoAddCircle, IoCart, IoInformationCircle, IoCheckmarkDone } from "react-icons/io5";
import { useCart } from "../context/CartContext";

const Card = ({ item }) => {
  const { id, nombre, imagen, precio, stock, descripcion } = item;
  const [showModal, setShowModal] = useState(false);
  const { addToCart, isInCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stock > 0) {
      addToCart(item);
      toast.success(`${nombre} agregado al carrito`, {
        icon: <IoCart className="text-blue-500" size={18} />,
        position: "top-center",
        description: `Precio: $${precio.toLocaleString()}`,
      });
    } else {
      toast.error('Producto agotado', {
        position: "top-center",
        description: 'Lo sentimos, este producto no está disponible actualmente',
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors expand={false} />
      
      {/* Modal de Detalles */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{nombre}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 overflow-hidden rounded-lg">
                <img 
                  src={imagen} 
                  alt={nombre} 
                  className="w-full h-64 object-contain bg-gray-50"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                  }}
                />
              </div>
              
              <div className="space-y-4">
                {descripcion && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Descripción:</h4>
                    <p className="text-gray-600">{descripcion}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-blue-600">${precio.toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stock > 0 ? `Disponible: ${stock}` : 'Agotado'}
                  </span>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <IoCart size={18} />
                  {isInCart(id) ? 'Ya en el carrito' : stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta de Producto */}
      <div className="h-full">
        <div 
          className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md h-full flex flex-col ${
            stock === 0 ? 'opacity-80 grayscale-[20%]' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge de Agotado */}
          {stock === 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                AGOTADO
              </span>
            </div>
          )}
          
          {/* Imagen del Producto */}
          <div 
            className="relative aspect-square bg-gray-50 cursor-pointer group flex-shrink-0"
            onClick={() => setShowModal(true)}
          >
            <img 
              src={imagen} 
              alt={nombre} 
              className={`w-full h-full object-contain p-4 transition-transform duration-300 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                e.target.className = 'w-full h-full object-cover p-0';
              }}
              loading="lazy"
            />
            
            {/* Overlay de información */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                <IoInformationCircle className="text-blue-500" />
                <span>Ver detalles</span>
              </div>
            </div>
          </div>
          
          {/* Contenido de la tarjeta */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 
              className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer min-h-[3rem] flex-grow" 
              onClick={() => setShowModal(true)}
              title={nombre}
            >
              {nombre}
            </h3>
            
            <div className="flex justify-between items-center mt-auto">
              <div>
                <span className="text-xl font-bold text-blue-600">${precio.toLocaleString()}</span>
                {stock > 0 && (
                  <span className="block text-xs text-gray-500 mt-1">
                    {stock > 10 ? 'Disponible' : `Últimas ${stock} unidades`}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={stock === 0 || isInCart(id)}
                className={`p-2 rounded-full transition-colors ${
                  isInCart(id)
                    ? 'text-green-500 bg-green-50 cursor-default'
                    : stock > 0
                      ? 'text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
                aria-label={isInCart(id) ? 'Producto en carrito' : stock > 0 ? 'Agregar al carrito' : 'Producto agotado'}
              >
                {isInCart(id) ? (
                  <IoCheckmarkDone className="w-6 h-6" />
                ) : (
                  <IoAddCircle className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-popIn {
          animation: popIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Card;