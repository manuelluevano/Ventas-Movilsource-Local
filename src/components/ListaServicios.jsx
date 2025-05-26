import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';


import commitInfo from './commit-info.json';

const VersionInfo = () => {
  const [showVersion, setShowVersion] = useState(false);

  const commitInfo = {
    message: "Agregamos filtros para los distintos estados de los servicios, un buscador por nombre, apellido, marca y/o modelo y un mensaje de confirmacion al cambiar el estado de un servicio",
    date: new Date().toLocaleDateString(),
    version: "1.1.0" // Puedes incrementar esto con cada cambio importante
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showVersion && (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <h3 className="font-bold text-gray-800">Últimos cambios (v{commitInfo.version})</h3>
          <p className="text-sm text-gray-600 mt-1">{commitInfo.message}</p>
          <p className="text-xs text-gray-500 mt-2">Actualizado: {commitInfo.date}</p>
        </div>
      )}
      <button 
        onClick={() => setShowVersion(!showVersion)}
        className="bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition"
        title="Ver cambios recientes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

const ListaServicios = ({ servicios, onEdit, onDelete, onStatusChange }) => {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newStatus, setNewStatus] = useState('');

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

  // Manejar inicio de cambio de estado (abre el diálogo)
  const handleStatusChangeInit = (e, servicio) => {
    setSelectedService(servicio);
    setNewStatus(e.target.value);
    setIsDialogOpen(true);
  };

  // Confirmar cambio de estado
  const confirmStatusChange = () => {
    if (onStatusChange && selectedService) {
      onStatusChange(selectedService.id, newStatus);
    }
    setIsDialogOpen(false);
  };

  // Cancelar cambio de estado
  const cancelStatusChange = () => {
    setIsDialogOpen(false);
  };

  // Filtrar servicios según el estado seleccionado y la búsqueda
  const serviciosFiltrados = servicios.filter(servicio => {
    const cumpleEstado = filtroEstado === 'todos' || servicio.estado === filtroEstado;
    const cumpleBusqueda = busqueda === '' || 
      `${servicio.nombre} ${servicio.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) || 
      servicio.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.modelo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleBusqueda;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Diálogo de confirmación - Versión corregida */}
      <Dialog 
        open={isDialogOpen} 
        onClose={cancelStatusChange}
        className="relative z-50"
      >
        {/* Fondo oscuro */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        {/* Contenedor del diálogo */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Confirmar cambio de estado
            </Dialog.Title>
            
            {selectedService && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  ¿Estás seguro que deseas cambiar el estado del servicio <strong>#{selectedService.folio}</strong> de{' '}
                  <span className={`px-2 py-1 rounded ${getEstadoColor(selectedService.estado)}`}>
                    {estadosDisponibles.find(e => e.value === selectedService.estado)?.label}
                  </span>{' '}
                  a{' '}
                  <span className={`px-2 py-1 rounded ${getEstadoColor(newStatus)}`}>
                    {estadosDisponibles.find(e => e.value === newStatus)?.label}
                  </span>?
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Cliente: {selectedService.nombre} {selectedService.apellido}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelStatusChange}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Resto del componente (igual que antes) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Servicios</h1>
        <div className="text-sm text-gray-500">
          Mostrando: <span className="font-medium">{serviciosFiltrados.length} de {servicios.length} servicios</span>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o servicio..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filtroEstado === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Todos
            </button>
            {estadosDisponibles.map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFiltroEstado(estado.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${filtroEstado === estado.value ? getEstadoColor(estado.value) + ' border-2 border-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de servicios */}
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
                <th scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              {serviciosFiltrados.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
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
                  <td className="px-4 py-4 whitespace-nowrap">
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
                      onChange={(e) => handleStatusChangeInit(e, servicio)}
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

      {serviciosFiltrados.length === 0 && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filtroEstado === 'todos' && busqueda === ''
              ? 'No hay servicios registrados' 
              : busqueda !== ''
                ? `No se encontraron resultados para "${busqueda}"`
                : `No hay servicios en estado "${estadosDisponibles.find(e => e.value === filtroEstado)?.label || filtroEstado}"`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filtroEstado === 'todos' && busqueda === ''
              ? 'Comienza agregando un nuevo servicio.' 
              : 'Intenta con otro filtro o término de búsqueda.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ListaServicios;