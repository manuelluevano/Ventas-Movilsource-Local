import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaChartLine, FaTools, FaBoxes, FaUsers, FaMoneyBillWave, FaBell } from 'react-icons/fa';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// API
import { getVentasXFecha, listAccesorios, listServices } from '../API/events';

// Componentes
import Exhibidor from '../components/Exhibidor';

const Administrador = () => {
  // Estados para datos
  const [servicios, setServicios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState({
    servicios: true,
    accesorios: true,
    ventas: true
  });
  const [error, setError] = useState(null);
  const [showExhibidor, setShowExhibidor] = useState(false);
  
  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroRapido, setFiltroRapido] = useState('hoy');

  // Efectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener servicios
        const serviciosRes = await listServices();
        console.log(serviciosRes.servicios);
        setServicios(serviciosRes.servicios);
        setLoading(prev => ({ ...prev, servicios: false }));

        // Obtener accesorios
        const accesoriosRes = await listAccesorios();
        setAccesorios(accesoriosRes.accesorios || []);
        setLoading(prev => ({ ...prev, accesorios: false }));

        // Obtener ventas
        const ventasRes = await getVentasXFecha(fechaInicio, fechaFin);
        setVentas(ventasRes.ventas || []);
        setLoading(prev => ({ ...prev, ventas: false }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [fechaInicio, fechaFin]);

  // Handlers
  const aplicarFiltroRapido = (filtro) => {
    setFiltroRapido(filtro);
    const hoy = new Date();
    
    switch(filtro) {
      case 'hoy':
        setFechaInicio(hoy.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
        break;
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        setFechaInicio(inicioSemana.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
        break;
      case 'mes':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        setFechaInicio(inicioMes.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
        break;
      case 'todos':
        setFechaInicio('');
        setFechaFin('');
        break;
      default:
        break;
    }
  };

  const toggleExhibidor = () => {
    setShowExhibidor(!showExhibidor);
  };

// Funciones de cálculo
const calcularMetricas = () => {
  const serviciosEnProceso = servicios.filter(s => s.estado === 'proceso').length;
  const serviciosTerminados = servicios.filter(s => s.estado === 'terminado').length;
  const serviciosRecibidos = servicios.filter(s => s.estado === 'recibido').length; // Corregí el nombre de la variable
  
  const totalVentas = ventas.length;
  const totalIngresos = ventas.reduce((sum, venta) => sum + (venta.total || 0), 0);
  
  const stockBajo = accesorios.filter(a => a.stock < 5).length;
  const accesoriosDisponibles = accesorios.length;
  
  return {
    servicios: {
      enProceso: serviciosEnProceso,
      terminados: serviciosTerminados,
      recibidos: serviciosRecibidos, // Corregí para usar la variable correcta
      total: servicios.length
    },
    ventas: {
      total: totalVentas,
      ingresos: totalIngresos,
      promedio: totalVentas > 0 ? totalIngresos / totalVentas : 0
    },
    inventario: {
      stockBajo,
      total: accesoriosDisponibles
    }
  };
};

const metricas = calcularMetricas();

// Datos para gráficos
const datosGraficoServicios = [
  { name: 'En proceso', value: metricas.servicios.enProceso },
  { name: 'Terminados', value: metricas.servicios.terminados },
  { name: 'Recibidos', value: metricas.servicios.recibidos } // Cambié "Entregados" por "Recibidos" para coincidir
];

const datosGraficoVentas = ventas.map(v => ({
  name: v.fecha_pedido ? new Date(v.fecha_pedido).toLocaleDateString() : 'Sin fecha',
  total: v.total || 0
}));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <FaBell className="text-gray-600" />
            </button>
            <div className="flex items-center">
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://via.placeholder.com/150" 
                alt="Usuario" 
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-9xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filtros rápidos */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              <button
                onClick={() => aplicarFiltroRapido('hoy')}
                className={`px-3 py-1 rounded-md text-sm ${filtroRapido === 'hoy' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Hoy
              </button>
              <button
                onClick={() => aplicarFiltroRapido('semana')}
                className={`px-3 py-1 rounded-md text-sm ${filtroRapido === 'semana' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Esta semana
              </button>
              <button
                onClick={() => aplicarFiltroRapido('mes')}
                className={`px-3 py-1 rounded-md text-sm ${filtroRapido === 'mes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Este mes
              </button>
              <button
                onClick={() => aplicarFiltroRapido('todos')}
                className={`px-3 py-1 rounded-md text-sm ${filtroRapido === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Todos
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <label htmlFor="fechaInicio" className="mr-2 text-sm text-gray-600">Desde:</label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="border rounded p-1 text-sm"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="fechaFin" className="mr-2 text-sm text-gray-600">Hasta:</label>
                <input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="border rounded p-1 text-sm"
                />
              </div>
              <button className="p-2 rounded bg-gray-200 hover:bg-gray-300">
                <FiRefreshCw className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mostrar Exhibidor o Dashboard según estado */}
        {showExhibidor ? (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Exhibidor de Productos</h2>
              <button 
                onClick={toggleExhibidor}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Volver al Dashboard
              </button>
            </div>
            <Exhibidor />
          </div>
        ) : (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Tarjeta Servicios */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Servicios en Proceso</p>
                    <p className="text-2xl font-semibold text-gray-900">{metricas.servicios.enProceso}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaTools className="text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total servicios</span>
                    <span>{metricas.servicios.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(metricas.servicios.enProceso / metricas.servicios.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Ventas */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                    <p className="text-2xl font-semibold text-gray-900">{metricas.ventas.total}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaMoneyBillWave className="text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Ingresos</span>
                    <span>${metricas.ventas.ingresos.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${metricas.ventas.total > 0 ? 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Inventario */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
                    <p className="text-2xl font-semibold text-gray-900">{metricas.inventario.stockBajo}</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaBoxes className="text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total accesorios</span>
                    <span>{metricas.inventario.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(metricas.inventario.stockBajo / metricas.inventario.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Clientes */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clientes Nuevos</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaUsers className="text-xl" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Este mes</span>
                    <span>+15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `15%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico de servicios */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Estado de Servicios</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <FiFilter className="mr-1" /> Filtrar
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosGraficoServicios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3B82F6" name="Servicios" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de ventas */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Historial de Ventas</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <FiFilter className="mr-1" /> Filtrar
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosGraficoVentas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#10B981" name="Ventas ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tablas de resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Últimos servicios */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Últimos Servicios</h2>
                  <Link to="/servicios" className="text-sm text-blue-600 hover:text-blue-800">
                    Ver todos
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {servicios.slice(-5).map((servicio) => (
                        <tr key={servicio.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{servicio.folio}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.nombre} { } {servicio.apellido}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              servicio.estado === 'proceso' ? 'bg-yellow-100 text-yellow-800' :
                              servicio.estado === 'terminado' ? 'bg-purple-100 text-purple-800' :
                              servicio.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {servicio.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${servicio.precio_servicio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accesorios con bajo stock */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Accesorios con Bajo Stock</h2>
                  <Link to="/accesorios" className="text-sm text-blue-600 hover:text-blue-800">
                    Ver todos
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accesorios.filter(a => a.stock < 5).slice(0, 5).map((accesorio) => (
                        <tr key={accesorio._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{accesorio.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accesorio.categoria}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              accesorio.stock < 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {accesorio.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${accesorio.precio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Acciones rápidas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/servicios/nuevo"
            className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaPlusCircle className="text-blue-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Nuevo Servicio</span>
          </Link>
          <Link
            to="/accesorios/nuevo"
            className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaPlusCircle className="text-green-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Nuevo Accesorio</span>
          </Link>
          <button
            onClick={toggleExhibidor}
            className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaBoxes className="text-purple-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">
              {showExhibidor ? 'Ocultar Exhibidor' : 'Mostrar Exhibidor'}
            </span>
          </button>
          <Link
            to="/clientes"
            className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaUsers className="text-yellow-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Clientes</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Administrador;