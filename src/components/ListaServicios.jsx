import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import VersionInfo from "./VersionInfo";

const ListaServicios = ({ servicios, onEdit, onDelete, onStatusChange }) => {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [serviceToNotify, setServiceToNotify] = useState(null);
  const [skipNotification, setSkipNotification] = useState(false);
  const [filtroAno, setFiltroAno] = useState('');
  const [filtroMes, setFiltroMes] = useState('');

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

  // Obtener lista de años únicos basados en los servicios
  const getAnosDisponibles = () => {
    const anos = servicios.map(servicio => 
      servicio.fecha_registro ? new Date(servicio.fecha_registro).getFullYear() : new Date().getFullYear()
    );
    return [...new Set(anos)].sort((a, b) => b - a);
  };

  // Lista de meses disponibles
  const mesesDisponibles = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
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
      // Actualizar el estado localmente primero
      const updatedService = { ...selectedService, estado: newStatus };
      
      // Llamar a la función para actualizar en el backend
      onStatusChange(selectedService.id, newStatus);
      
      if (!skipNotification) {
        // Configurar el servicio actualizado para notificar
        setServiceToNotify(updatedService);
        
        // Abrir el diálogo de notificación
        setNotificationDialogOpen(true);
      }
    }
    setIsDialogOpen(false);
    setSkipNotification(false); // Resetear para la próxima vez
  };

  // Cancelar cambio de estado
  const cancelStatusChange = () => {
    setIsDialogOpen(false);
  };

  // Función para abrir el diálogo de notificación
  const openNotificationDialog = (servicio) => {
    setServiceToNotify(servicio);
    setNotificationDialogOpen(true);
  };

  // Función para enviar la notificación por WhatsApp con mensajes personalizados
  const sendWhatsAppNotification = () => {
    if (!serviceToNotify || !serviceToNotify.numero_contacto) {
      alert('No hay información de contacto para notificar');
      setNotificationDialogOpen(false);
      return;
    }

    // Validar número de teléfono (ejemplo básico)
    const phoneNumber = serviceToNotify.numero_contacto.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      alert('El número de teléfono no parece válido');
      return;
    }

    const estadoActual = estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label;
    
    // Mensajes personalizados según el estado
    let mensajeEstado = '';
    switch(serviceToNotify.estado) {
      case 'recibido':
        mensajeEstado = 'Hemos recibido su equipo y está en espera para ser revisado.';
        break;
      case 'proceso':
        mensajeEstado = 'Su equipo se encuentra en proceso de reparación. Nuestros técnicos están trabajando en él.';
        break;
      case 'terminado':
        mensajeEstado = '¡Su equipo está terminado y listo para ser retirado! Puede pasar por él a nuestro local.';
        break;
      case 'entregado':
        mensajeEstado = 'Su equipo ha sido marcado como entregado. ¡Gracias por confiar en nosotros!';
        break;
      case 'cancelado':
        mensajeEstado = 'Lamentamos informarle que el servicio ha sido cancelado. Puede contactarnos para más información.';
        break;
      default:
        mensajeEstado = `Su equipo se encuentra actualmente en estado: ${estadoActual}.`;
    }

    // Construir el mensaje
    const message = [
      `Hola ${serviceToNotify.nombre},`,
      '',
      '*Información de su servicio:*',
      `📱 Dispositivo: ${serviceToNotify.marca} ${serviceToNotify.modelo}`,
      `📝 Folio: #${serviceToNotify.folio}`,
      `🔄 Estado: ${estadoActual}`,
      '',
      '*Detalles:*',
      `${mensajeEstado}`,
      '',
      '*Fechas importantes:*',
      `📅 Registro: ${formatDate(serviceToNotify.fecha_registro)}`,
      `📅 Entrega estimada: ${formatDate(serviceToNotify.fecha_entrega) || 'Por confirmar'}`,
      '',
      `ℹ️ Para cualquier consulta, no dude en responder este mensaje.`
    ].join('\n');

    // Codificar componentes de la URL
    const numeroCodificado = encodeURIComponent(phoneNumber);
    const mensajeCodificado = encodeURIComponent(message);
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${numeroCodificado}&text=${mensajeCodificado}&app_absent=1`;
    
    // Abrir en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    setNotificationDialogOpen(false);
  };

  // Filtrar servicios según los criterios seleccionados
  const serviciosFiltrados = servicios.filter(servicio => {
    const fechaRegistro = new Date(servicio.fecha_registro);
    const anoRegistro = fechaRegistro.getFullYear().toString();
    const mesRegistro = (fechaRegistro.getMonth() + 1).toString().padStart(2, '0');
    
    const cumpleEstado = filtroEstado === 'todos' || servicio.estado === filtroEstado;
    const cumpleBusqueda = busqueda === '' || 
      `${servicio.nombre} ${servicio.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) || 
      servicio.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.modelo.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleAno = filtroAno === '' || anoRegistro === filtroAno;
    const cumpleMes = filtroMes === '' || mesRegistro === filtroMes;
    
    return cumpleEstado && cumpleBusqueda && cumpleAno && cumpleMes;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <VersionInfo />

      {/* Diálogo de confirmación de cambio de estado */}
      <Dialog open={isDialogOpen} onClose={cancelStatusChange} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
      
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="skipNotification"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={skipNotification}
          onChange={(e) => setSkipNotification(e.target.checked)}
        />
        <label htmlFor="skipNotification" className="ml-2 block text-sm text-gray-700">
          No notificar al cliente
        </label>
      </div>
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

      {/* Diálogo para notificación al cliente */}
      <Dialog open={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Notificar al cliente
            </Dialog.Title>
            
            {serviceToNotify && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-700">
                  Se enviará un mensaje por WhatsApp a <strong>{serviceToNotify.nombre} {serviceToNotify.apellido}</strong>
                </p>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium">Número:</p>
                  <p className="text-sm">{serviceToNotify.numero_contacto}</p>
                  
                  <p className="text-sm font-medium mt-2">Dispositivo:</p>
                  <p className="text-sm">{serviceToNotify.marca} {serviceToNotify.modelo}</p>
                  
                  <p className="text-sm font-medium mt-2">Estado actual:</p>
                  <p className="text-sm">
                    <span className={`px-2 py-1 rounded ${getEstadoColor(serviceToNotify.estado)}`}>
                      {estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label}
                    </span>
                  </p>
                  
                  <p className="text-sm font-medium mt-2">Mensaje que se enviará:</p>
                  <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                    <p className="font-semibold">Hola {serviceToNotify.nombre},</p>
                    <p className="mt-1"></p>
                    
                    <p className="mt-2 font-semibold">Información de su servicio:</p>
                    <p>📱 Dispositivo: {serviceToNotify.marca} {serviceToNotify.modelo}</p>
                    <p>📝 Folio: #{serviceToNotify.folio}</p>
                    <p>🔄 Estado: {estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label}</p>
                    
                    <p className="mt-2 font-semibold">Detalles:</p>
                    <p>
                      {serviceToNotify.estado === 'proceso' 
                        ? 'Su equipo se encuentra en proceso de reparación. Nuestros técnicos están trabajando en él.'
                        : serviceToNotify.estado === 'terminado'
                        ? '¡Su equipo está terminado y listo para ser retirado! Puede pasar por él a nuestro local.'
                        : serviceToNotify.estado === 'entregado'
                        ? 'Su equipo ha sido marcado como entregado. ¡Gracias por confiar en nosotros!'
                        : serviceToNotify.estado === 'recibido'
                        ? 'Hemos recibido su equipo y está en espera para ser revisado.'
                        : serviceToNotify.estado === 'cancelado'
                        ? 'Lamentamos informarle que el servicio ha sido cancelado. Puede contactarnos para más información.'
                        : `Su equipo se encuentra actualmente en estado: ${estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label}.`
                      }
                    </p>
                    
                    <p className="mt-2 font-semibold">Fechas importantes:</p>
                    <p>📅 Registro: {formatDate(serviceToNotify.fecha_registro)}</p>
                    <p>📅 Entrega estimada: {formatDate(serviceToNotify.fecha_entrega) || 'Por confirmar'}</p>
                    
                    <p className="mt-2">ℹ️ Para cualquier consulta, no dude en responder este mensaje.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setNotificationDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={sendWhatsAppNotification}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-12.968c-5.258 0-9.525 4.267-9.525 9.525 0 1.697.448 3.28 1.23 4.655L2 22l5.233-1.354a9.53 9.53 0 0 0 4.949 1.379c5.258 0 9.525-4.267 9.525-9.525S16.508 2.039 11.25 2.039z"/>
                </svg>
                Enviar por WhatsApp
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

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

        {/* Filtros por año y mes */}
        <div className="flex flex-wrap gap-4 mt-4">
          {/* Filtro por año */}
          <div className="flex items-center">
            <label htmlFor="filtro-ano" className="mr-2 text-sm font-medium text-gray-700">
              Año:
            </label>
            <select
              id="filtro-ano"
              value={filtroAno}
              onChange={(e) => {
                setFiltroAno(e.target.value);
                setFiltroMes(''); // Resetear mes cuando cambia el año
              }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {getAnosDisponibles().map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>

          {/* Filtro por mes */}
          <div className="flex items-center">
            <label htmlFor="filtro-mes" className="mr-2 text-sm font-medium text-gray-700">
              Mes:
            </label>
            <select
              id="filtro-mes"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={!filtroAno} // Deshabilitar si no hay año seleccionado
            >
              <option value="">Todos</option>
              {mesesDisponibles.map(mes => (
                <option key={mes.value} value={mes.value}>{mes.label}</option>
              ))}
            </select>
          </div>

          {/* Botón para limpiar filtros */}
          <button
            onClick={() => {
              setFiltroAno('');
              setFiltroMes('');
              setFiltroEstado('todos');
              setBusqueda('');
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Limpiar filtros
          </button>
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
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openNotificationDialog(servicio)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Notificar
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
            {filtroEstado === 'todos' && busqueda === '' && filtroAno === '' && filtroMes === ''
              ? 'No hay servicios registrados' 
              : busqueda !== ''
                ? `No se encontraron resultados para "${busqueda}"`
                : filtroAno || filtroMes
                  ? `No hay servicios en ${filtroMes ? mesesDisponibles.find(m => m.value === filtroMes)?.label + ' ' : ''}${filtroAno || ''}${filtroEstado !== 'todos' ? ` con estado "${estadosDisponibles.find(e => e.value === filtroEstado)?.label || filtroEstado}"` : ''}`
                  : `No hay servicios en estado "${estadosDisponibles.find(e => e.value === filtroEstado)?.label || filtroEstado}"`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filtroEstado === 'todos' && busqueda === '' && filtroAno === '' && filtroMes === ''
              ? 'Comienza agregando un nuevo servicio.' 
              : 'Intenta con otro filtro o término de búsqueda.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ListaServicios;