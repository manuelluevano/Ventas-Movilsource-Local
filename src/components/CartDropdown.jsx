import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiPlus, FiMinus, FiX, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { createReportsAccesorio } from "../API/events";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import "./CartDropdown.css"; // Archivo CSS para las animaciones

const CartDropdown = () => {
    const navigate = useNavigate();

  const [metodo_pago, setMetodoPago] = useState('efectivo');
  const { tokenUser } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const procesarVenta = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega productos para continuar',
        icon: 'warning',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Verificar stock
      const sinStock = cart.filter(item => item.quantity > item.stock);
      
      if (sinStock.length > 0) {
        Swal.fire({
          title: 'Stock insuficiente',
          html: `
            <div class="text-left">
              <p>Los siguientes productos no tienen suficiente stock:</p>
              <ul class="list-disc pl-5 mt-2">
                ${sinStock.map(item => `<li>${item.nombre} (Stock: ${item.stock})</li>`).join('')}
              </ul>
            </div>
          `,
          icon: 'error',
          confirmButtonColor: '#6366f1',
        });
        return;
      }

      const detallesOBJ = cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio: item.precio,
        stock: item.stock
      }));

      const venta = {
        fecha_pedido: new Date().toISOString(),
        id_vendedor: tokenUser.id,
        items: detallesOBJ,
        detalles: JSON.stringify(detallesOBJ),
        metodo_pago,
        comentarios: "Nada",
        total: totalPrice.toFixed(2)
      };

      const response = await createReportsAccesorio(venta);
      clearCart();

      Swal.fire({
        title: '¡Venta exitosa!',
        html: `
          <div class="text-center">
            <p class="text-lg mb-2">${response.message}</p>
            <p class="text-indigo-600 font-medium">${response.mensaje}</p>
            <div class="mt-4 text-sm text-gray-500">
              Total: <span class="font-bold">$${totalPrice.toFixed(2)}</span>
            </div>
            <div class="mt-2 text-xs text-gray-400">
              ${new Date().toLocaleString()}
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#6366f1',
      });
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar la venta',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <FiShoppingCart className="text-white mr-3" size={22} />
            <h2 className="text-lg font-semibold text-white">
              Tu Carrito ({totalItems})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-indigo-200 hover:text-white text-sm font-medium transition-colors"
              >
                Vaciar
              </button>
            )}
            <button 
              onClick={() => navigate("/accesorios")}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <FiShoppingCart className="text-indigo-400" size={28} />
            </div>
            <h3 className="text-base font-medium text-gray-700 mb-1">
              Carrito vacío
            </h3>
            <p className="text-sm text-gray-500">
              Agrega productos para continuar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Cart Items */}
            <ul className="max-h-[50vh] overflow-y-auto">
              <TransitionGroup component={null}>
                {cart.map(item => (
                  <CSSTransition
                    key={item.id}
                    timeout={300}
                    classNames="cart-item"
                  >
                    <li className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.imagen} 
                            alt={item.nombre} 
                            className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=Imagen+no+disponible';
                            }}
                          />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-800 truncate">
                                {item.nombre}
                              </h3>
                              <span className="text-sm text-gray-500">
                                ${item.precio} c/u
                              </span>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-indigo-600">
                              ${(item.precio * item.quantity).toFixed(2)}
                            </span>
                            
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus size={14} />
                              </button>
                              
                              <span className="px-2 text-sm font-medium">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={item.quantity >= item.stock}
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ul>

            {/* Summary */}
            <div className="p-4 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-base">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de pago
                  </label>
                  <select
                    value={metodo_pago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={procesarVenta}
                disabled={isProcessing || cart.length === 0}
                className={`w-full py-2 rounded-md flex items-center justify-center gap-2 font-medium ${
                  isProcessing 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    Completar venta <FiArrowRight className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;