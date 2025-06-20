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
      const updatedService = { ...selectedService, estado: newStatus };
      onStatusChange(selectedService.id, newStatus);
      
      if (!skipNotification) {
        setServiceToNotify(updatedService);
        setNotificationDialogOpen(true);
      }
    }
    setIsDialogOpen(false);
    setSkipNotification(false);
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

    const phoneNumber = serviceToNotify.numero_contacto.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      alert('El número de teléfono no parece válido');
      return;
    }

    const estadoActual = estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label;
    
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

    const message = [
      `Hola ${serviceToNotify.nombre} ${serviceToNotify.apellido},`,
      '',
      '*Información de su servicio:*',
      `📱 Dispositivo: ${serviceToNotify.marca} ${serviceToNotify.modelo}`,
      `📝 Folio: #${serviceToNotify.folio}`,
      `🔄 Estado: ${estadoActual}`,
      '',
      '*Detalles:*',
      `${mensajeEstado}`,
      ...(serviceToNotify.estado === 'terminado' ? [
        '',
        '*Información de pago:*',
        `💰 Total servicio: $ ${serviceToNotify.precio_servicio}`,
        `💵 Abono realizado: $ ${serviceToNotify.abono_servicio}`,
        `📊 Saldo pendiente: $ ${serviceToNotify.precio_servicio - serviceToNotify.abono_servicio}`,
      ] : []),
      '',
      '*Fechas importantes:*',
      `📅 Registro: ${formatDate(serviceToNotify.fecha_registro)}`,
      `📅 Entrega estimada: ${formatDate(serviceToNotify.fecha_entrega) || 'Por confirmar'}`,
      '',
      `ℹ️ Para cualquier consulta, no dude en responder este mensaje.`
    ].join('\n');

    const numeroCodificado = encodeURIComponent(phoneNumber);
    const mensajeCodificado = encodeURIComponent(message);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${numeroCodificado}&text=${mensajeCodificado}&app_absent=1`;
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
              Confirmar cambio de estado
            </Dialog.Title>
            
            {selectedService && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-700">
                  ¿Estás seguro que deseas cambiar el estado del servicio <strong>#{selectedService.folio}</strong> de{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedService.estado)}`}>
                    {estadosDisponibles.find(e => e.value === selectedService.estado)?.label}
                  </span>{' '}
                  a{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(newStatus)}`}>
                    {estadosDisponibles.find(e => e.value === newStatus)?.label}
                  </span>?
                </p>
                <p className="text-sm text-gray-500">
                  Cliente: {selectedService.nombre} {selectedService.apellido}
                </p>
                
                <div className="mt-4 flex items-start">
                  <input
                    type="checkbox"
                    id="skipNotification"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Diálogo para notificación al cliente */}
      <Dialog open={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            {serviceToNotify && (
              <div className="space-y-4">
                {/* Encabezado */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    Se enviará un mensaje por WhatsApp a: 
                    <span className="font-semibold ml-1">{serviceToNotify.nombre} {serviceToNotify.apellido}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Número: {serviceToNotify.numero_contacto}</p>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {/* Tarjeta de información del servicio */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">Detalles del servicio</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">📱</span>
                        <p className="text-sm">
                          <span className="font-medium">Dispositivo:</span> {serviceToNotify.marca} {serviceToNotify.modelo}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">📝</span>
                        <p className="text-sm">
                          <span className="font-medium">Folio:</span> #{serviceToNotify.folio}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">🔄</span>
                        <div className="text-sm">
                          <span className="font-medium">Estado:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(serviceToNotify.estado)}`}>
                            {estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta de información de pago */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">Información de pago</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Precio del servicio:</span>
                        <span className="text-sm font-semibold">${serviceToNotify.precio_servicio || 'Por confirmar'}</span>
                      </div>
                      
                      {serviceToNotify.abono_servicio ? (
                        <>
                          <div className="flex justify-between text-green-600">
                            <span className="text-sm font-medium">Abono realizado:</span>
                            <span className="text-sm font-semibold">-${serviceToNotify.abono_servicio}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Saldo pendiente:</span>
                              <span className="text-sm font-semibold text-blue-600">
                                ${serviceToNotify.precio_servicio - serviceToNotify.abono_servicio}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No se registran abonos realizados</div>
                      )}
                      
                      {serviceToNotify.estado === 'terminado' && (
                        <div className="mt-2 text-xs bg-yellow-50 text-yellow-700 p-2 rounded">
                          ℹ️ El pago total debe realizarse al momento de entregar el dispositivo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vista previa del mensaje */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">Vista previa del mensaje</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800">Hola {serviceToNotify.nombre}{serviceToNotify.apellido && ` ${serviceToNotify.apellido}`},</p>
                    
                    <div className="mt-3 space-y-3 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Información de su servicio:</span><br/>
                        📱 Dispositivo: {serviceToNotify.marca} {serviceToNotify.modelo}<br/>
                        📝 Folio: #{serviceToNotify.folio}<br/>
                        🔄 Estado: {estadosDisponibles.find(e => e.value === serviceToNotify.estado)?.label}
                      </p>
                      
                      <p>
                        <span className="font-semibold">Detalles:</span><br/>
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
                      
                      <p>
                        <span className="font-semibold">Fechas importantes:</span><br/>
                        📅 Registro: {formatDate(serviceToNotify.fecha_registro)}<br/>
                        📅 Entrega estimada: {formatDate(serviceToNotify.fecha_entrega) || 'Por confirmar'}
                      </p>
                      
                      <p className="text-sm mt-4">
                        ℹ️ Para cualquier consulta, no dude en responder este mensaje.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
              <button
                onClick={() => setNotificationDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={sendWhatsAppNotification}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mostrando: <span className="font-medium">{serviciosFiltrados.length} de {servicios.length} servicios</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block h-8 w-1 bg-blue-500 rounded-full"></span>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500">Total servicios</p>
            <p className="text-xl font-bold text-gray-900">{servicios.length}</p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, dispositivo o servicio..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtroEstado === 'todos' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            {estadosDisponibles.map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFiltroEstado(estado.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtroEstado === estado.value ? `${getEstadoColor(estado.value)} shadow-md border-2 border-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros por año y mes */}
        <div className="flex flex-wrap gap-4">
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
                setFiltroMes('');
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
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
              className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              disabled={!filtroAno}
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
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>
        </div>
      </div>

      
      {/* Tabla de servicios */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Folio
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Montos
                </th>
                <th scope="col" className="px-5 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48">
                  Observaciones
                </th>
                <th scope="col" className="px-5 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviciosFiltrados.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{servicio.folio}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {servicio.nombre.charAt(0)}{servicio.apellido?.charAt(0) || ''}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{servicio.nombre} {servicio.apellido}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[140px]">{servicio.numero_contacto}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{servicio.marca}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[120px]">{servicio.modelo}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize truncate max-w-[140px]">{servicio.servicio}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[140px]">{servicio.gaveta && `Gaveta: ${servicio.gaveta}`}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-[140px]">Registro: {formatDate(servicio.fecha_registro)}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[140px]">Entrega: {formatDate(servicio.fecha_entrega)}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <select
                      value={servicio.estado}
                      onChange={(e) => handleStatusChangeInit(e, servicio)}
                      className={`px-3 py-1 text-sm leading-5 font-semibold rounded-full ${getEstadoColor(servicio.estado)} border border-transparent hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
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
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Total: ${servicio.precio_servicio}</div>
                    <div className="text-sm text-gray-500">Abono: ${servicio.abono_servicio || '0'}</div>
                    <div className="text-sm font-medium text-blue-600">
                      Saldo: ${servicio.saldo_pendiente || (servicio.precio_servicio - (servicio.abono_servicio || 0)).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-[180px]">
                    <div className="text-sm text-gray-900 line-clamp-2" title={servicio.observaciones}>
                      {servicio.observaciones}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(servicio)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                      title="Editar servicio"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openNotificationDialog(servicio)}
                      className="text-green-600 hover:text-green-900 transition-colors p-1"
                      title="Notificar cliente"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(servicio.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                      title="Eliminar servicio"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {serviciosFiltrados.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filtroEstado === 'todos' && busqueda === '' && filtroAno === '' && filtroMes === ''
              ? 'No hay servicios registrados' 
              : busqueda !== ''
                ? `No se encontraron resultados para "${busqueda}"`
                : filtroAno || filtroMes
                  ? `No hay servicios en ${filtroMes ? mesesDisponibles.find(m => m.value === filtroMes)?.label + ' ' : ''}${filtroAno || ''}${filtroEstado !== 'todos' ? ` con estado "${estadosDisponibles.find(e => e.value === filtroEstado)?.label || filtroEstado}"` : ''}`
                  : `No hay servicios en estado "${estadosDisponibles.find(e => e.value === filtroEstado)?.label || filtroEstado}"`}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {filtroEstado === 'todos' && busqueda === '' && filtroAno === '' && filtroMes === ''
              ? 'Comienza agregando un nuevo servicio.' 
              : 'Intenta con otro filtro o término de búsqueda.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setFiltroAno('');
                setFiltroMes('');
                setFiltroEstado('todos');
                setBusqueda('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaServicios;