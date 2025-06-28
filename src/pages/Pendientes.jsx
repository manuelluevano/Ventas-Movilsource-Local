import { useState } from "react";
import { toast } from "sonner";
import { formatearFecha } from "../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const Pendientes = () => {
  // Estado inicial con datos de ejemplo
  const [listaPendientes, setListaPendientes] = useState({
    contador: 5,
    pendientesNoTerminados: 3,
    pendientesRealizados: 2,
    listPendientes: [
      {
        "_id": "1",
        "pendiente": "MICA HIDROGEL PARA IPHONE 12",
        "detalle": "Cliente Juan Pérez, color transparente",
        "telefono": "5512345678",
        "dia": "2023-11-15T00:00:00.000Z",
        "status": false
      },
      {
        "_id": "2",
        "pendiente": "REPARACIÓN DE AUDÍFONOS",
        "detalle": "Audífonos Sony XB550, falla en el lado izquierdo",
        "telefono": "5556781234",
        "dia": "2023-11-10T00:00:00.000Z",
        "status": true
      },
      {
        "_id": "3",
        "pendiente": "CAMBIO DE PUERTO DE CARGA SAMSUNG",
        "detalle": "Modelo Galaxy S20, cliente lo recoge en la tarde",
        "telefono": "5523456789",
        "dia": "2023-11-18T00:00:00.000Z",
        "status": false
      },
      {
        "_id": "4",
        "pendiente": "VENTA DE CARGADOR INALÁMBRICO",
        "detalle": "Cliente quiere 2 cargadores inalámbricos de 15W",
        "telefono": "5578912345",
        "dia": "2023-11-08T00:00:00.000Z",
        "status": true
      },
      {
        "_id": "5",
        "pendiente": "REVISIÓN DE TABLET HUAWEI",
        "detalle": "No enciende, posible falla de batería",
        "telefono": "5534567891",
        "dia": "2023-11-20T00:00:00.000Z",
        "status": false
      }
    ]
  });

  const [showForm, setShowForm] = useState(false);
  const [pendiente, setPendiente] = useState("");
  const [detalle, setDetalle] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("todos"); // 'todos', 'pendientes', 'completados'

  // Filtrar pendientes según el estado seleccionado
  const pendientesFiltrados = listaPendientes.listPendientes.filter(item => {
    if (filtro === "pendientes") return !item.status;
    if (filtro === "completados") return item.status;
    return true; // 'todos'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pendiente || !detalle || !telefono || !fechaEntrega) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      // Simulación de agregar pendiente
      const newPendiente = {
        _id: Date.now().toString(),
        pendiente: pendiente.toUpperCase(),
        detalle,
        telefono,
        dia: fechaEntrega.toISOString(),
        status: false
      };
      
      setListaPendientes(prev => ({
        ...prev,
        contador: prev.contador + 1,
        pendientesNoTerminados: prev.pendientesNoTerminados + 1,
        listPendientes: [...prev.listPendientes, newPendiente]
      }));
      
      toast.success("Pendiente agregado correctamente");
      setShowForm(false);
      // Resetear formulario
      setPendiente("");
      setDetalle("");
      setTelefono("");
      setFechaEntrega(new Date());
    } catch (error) {
      console.error("Error al agregar pendiente:", error);
      toast.error("Error al agregar el pendiente");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "¿Marcar como completado?",
        text: "¿Estás seguro de que deseas marcar este pendiente como completado?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, completado",
        cancelButtonText: "Cancelar"
      });

      if (isConfirmed) {
        setLoading(true);
        // Simulación de cambio de estado
        setListaPendientes(prev => {
          const updatedList = prev.listPendientes.map(item => {
            if (item._id === id) {
              return { ...item, status: !item.status };
            }
            return item;
          });
          
          const countCompleted = updatedList.filter(item => item.status).length;
          
          return {
            ...prev,
            listPendientes: updatedList,
            pendientesNoTerminados: updatedList.length - countCompleted,
            pendientesRealizados: countCompleted
          };
        });
        
        toast.success("Estado actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Lista de Pendientes</h1>
              <p className="text-blue-100 mt-1">Administra tus tareas pendientes</p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium border border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
              >
                <option value="todos">Todos</option>
                <option value="pendientes">Pendientes</option>
                <option value="completados">Completados</option>
              </select>
              
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              >
                {showForm ? "Cancelar" : "+ Nuevo Pendiente"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-100">Total Pendientes</div>
              <div className="text-2xl font-bold mt-1">{listaPendientes.contador || 0}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-100">Pendientes</div>
              <div className="text-2xl font-bold mt-1">{listaPendientes.pendientesNoTerminados || 0}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-100">Completados</div>
              <div className="text-2xl font-bold mt-1">{listaPendientes.pendientesRealizados || 0}</div>
            </div>
          </div>
        </div>

        {/* Formulario para nuevo pendiente */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Pendiente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendiente *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Ej: Mica Hidrogel"
                    value={pendiente}
                    onChange={(e) => setPendiente(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Número de contacto"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detalle *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="3"
                  placeholder="Detalles adicionales..."
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Entrega *
                  </label>
                  <DatePicker
                    selected={fechaEntrega}
                    onChange={(date) => setFechaEntrega(date)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    required
                  />
                </div>
                
                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      "Guardar Pendiente"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Lista de pendientes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Pendiente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Detalle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha Entrega
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : pendientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-lg font-medium">
                          No hay pendientes {filtro === "todos" ? "registrados" : filtro === "pendientes" ? "pendientes" : "completados"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendientesFiltrados.map((item) => (
                    <tr 
                      key={item._id} 
                      className={item.status ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.pendiente}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700 line-clamp-2">{item.detalle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${new Date(item.dia) < new Date() && !item.status ? "text-red-600" : "text-gray-900"}`}>
                          {formatearFecha(item.dia)}
                          {new Date(item.dia) < new Date() && !item.status && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Atrasado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`tel:${item.telefono}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {item.telefono}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleChangeStatus(item._id)}
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            item.status 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {item.status ? (
                            <>
                              <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completado
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Pendiente
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pendientes;