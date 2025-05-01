import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";

import { FiShoppingCart, FiPlus, FiMinus, FiX, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { createReportsAccesorio } from "../API/events";

const CartDropdown = () => {
  const [vendedor, setVendedor] = useState('');
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



  // Procesar la venta
  const procesarVenta = async () => {
    if (cart.length === 0) {
      message.warning('El carrito está vacío');
      return;
    }

    // setLoading(true);
    try {
      // 1. Verificar stock antes de procesar
      const sinStock = cart.filter(item => item.quantity > item.stock);
      
      console.log(sinStock);
      
      
      if (sinStock.length > 0) {
         Swal.fire({
                title: response.message,
                text: ``,
                icon: "success",
              });
              Swal.fire({
                title: response.mensaje,
                text: ``,
                icon: "success",
              });
        
        return;
      }

      const detallesOBJ = cart.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio: item.precio,
        stock: item.stock
      }))

     

     const detalles = JSON.stringify(detallesOBJ);
      
      
      // 2. Crear objeto de venta
      const venta = {
        fecha_pedido: new Date().toISOString(),
        id_vendedor: tokenUser.id,
        items: detallesOBJ,
        detalles,
        metodo_pago,
        comentarios: "Nada",
        total:  totalPrice.toFixed(2)
      };

      console.log(venta);
      // 3. Enviar a la API GENERAR REPORTE
      // 4. Actualizar stock localmente
      const response = await createReportsAccesorio(venta);
      
      // console.log(response);
      
      
      // 5. Mostrar confirmación y generar reporte
      clearCart();

      Swal.fire({
        title: response.message,
        text: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
      // // 6. Generar PDF automáticamente
      // generarReportePDF(response);
      
    } catch (error) {
      // message.error('Error al procesar la venta: ' + error.message);
    } finally {
      // setLoading(false);
      // setVisible(false);
    }
  };

 

  return (
    <div className="cart-dropdown grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 p-3">
        {/* Header del carrito */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center">
        <FiShoppingCart className="text-indigo-600 mr-2" size={20} />
        <h2 className="text-lg font-semibold">Tu Carrito ({totalItems})</h2>
      </div>

      
      {cart.length === 0 ? (
      <div className="p-6 text-center text-gray-500">
      <p>Tu carrito está vacío</p>
    </div>
      ) : (
        <>
          <ul className="border border-gray-300 p-2 rounded-lg">
            {cart.map(item => (
              <li key={item.id} className="p-2">
                <div className="flex justify-between">
                    {/* Info del producto */}
                <div className="flex space-x-2">
                <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="w-14 h-14 object-cover rounded-md"
                  />
               
                  <h3 className="font-normal">{item.nombre}</h3>
                  <span className="text-sm text-gray-600">${item.precio}</span>
                  <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <FiPlus size={14} />
                    </button>
                </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm mt-2 flex items-center hover:text-red-600">
                  Eliminar
                </button>
                
              </li>
            ))}
          </ul>
         

           {/* Resumen de compra */}

        <div className="border-t p-6 bg-gray-50">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              {/* <span>${subtotal.toFixed(2)}</span> */}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              {/* <span>${shipping.toFixed(2)}</span> */}
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <div className="cart-total">
            <strong className="font-semibold mt-2" >Total: ${totalPrice.toFixed(2)}</strong>
          </div>           
          
          </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
            onClick={()=> procesarVenta()}
          >
            Proceder al pago <FiArrowRight className="ml-2" />
          </button>
        </div>
        </>
      )}

     



    </div>
  );
};

export default CartDropdown;

