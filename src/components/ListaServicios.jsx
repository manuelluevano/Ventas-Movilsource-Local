import React from 'react';

const ListaServicios = ({ servicios, onEdit, onDelete, onStatusChange }) => {
  
  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'Pendiente';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para determinar el color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'recibido':
        return 'bg-blue-100 text-blue-800';
      case 'proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminado':
        return 'bg-purple-100 text-purple-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Opciones de estados disponibles
  const estadosDisponibles = [
    { value: 'recibido', label: 'Recibido' },
    { value: 'proceso', label: 'En proceso' },
    { value: 'terminado', label: 'Terminado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  // Manejar cambio de estado
  const handleStatusChange = (e, servicioId) => {
    const nuevoEstado = e.target.value;
    if (onStatusChange) {
      onStatusChange(servicioId, nuevoEstado);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Servicios</h1>
        <div className="text-sm text-gray-500">
          Total: <span className="font-medium">{servicios.length} servicios</span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Folio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{servicio.folio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{servicio.nombre} {servicio.apellido}</div>
                        <div className="text-sm text-gray-500">{servicio.numero_contacto}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{servicio.marca}</div>
                    <div className="text-sm text-gray-500">{servicio.modelo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{servicio.servicio}</div>
                    <div className="text-sm text-gray-500">{servicio.gaveta && `Gaveta: ${servicio.gaveta}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Registro: {formatDate(servicio.fecha_registro)}</div>
                    <div className="text-sm text-gray-500">Entrega: {formatDate(servicio.fecha_entrega)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={servicio.estado}
                      onChange={(e) => handleStatusChange(e, servicio.id)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded ${getEstadoColor(servicio.estado)} border border-transparent hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                      {estadosDisponibles.map((estado) => (
                        <option 
                          key={estado.value} 
                          value={estado.value}
                          className={estado.value === servicio.estado ? 'font-bold' : ''}
                        >
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Total: ${servicio.precio_servicio}</div>
                    <div className="text-sm text-gray-500">Abono: ${servicio.abono_servicio || '0.00'}</div>
                    <div className="text-sm font-medium text-red-400">
                      Saldo: ${servicio.saldo_pendiente || (servicio.precio_servicio - (servicio.abono_servicio || 0)).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{servicio.observaciones}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(servicio)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(servicio.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje cuando no hay servicios */}
      {servicios.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios registrados</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo servicio.</p>
        </div>
      )}
    </div>
  );
};

export default ListaServicios;