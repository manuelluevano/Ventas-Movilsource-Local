import { useState } from "react";
import { toast } from "sonner";
import { formatearFecha } from "../helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-grow flex flex-col">
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex-grow flex flex-col">
          {/* Header */}
          <div className="bg-movilsource-400 p-6 text-white">
            <h1 className="text-3xl font-bold">Lista de Pendientes</h1>
            
            <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
              <div className="stats-card bg-blue-700">
                <span>Total Pendientes</span>
                <span className="text-2xl font-bold">{listaPendientes.contador || 0}</span>
              </div>
              
              <div className="stats-card bg-red-500">
                <span>Pendientes</span>
                <span className="text-2xl font-bold">{listaPendientes.pendientesNoTerminados || 0}</span>
              </div>
              
              <div className="stats-card bg-green-500">
                <span>Completados</span>
                <span className="text-2xl font-bold">{listaPendientes.pendientesRealizados || 0}</span>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="bg-white text-gray-800 px-3 py-2 rounded-lg font-medium"
                >
                  <option value="todos">Todos</option>
                  <option value="pendientes">Pendientes</option>
                  <option value="completados">Completados</option>
                </select>
                
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                >
                  {showForm ? "Cancelar" : "Nuevo Pendiente"}
                </button>
              </div>
            </div>
          </div>

          {/* Formulario para nuevo pendiente */}
          {showForm && (
            <div className="p-6 border-b">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pendiente *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                  
                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {loading ? "Guardando..." : "Guardar Pendiente"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Lista de pendientes */}
          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendiente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      Cargando pendientes...
                    </td>
                  </tr>
                ) : pendientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay pendientes {filtro === "todos" ? "registrados" : filtro === "pendientes" ? "pendientes" : "completados"}
                    </td>
                  </tr>
                ) : (
                  pendientesFiltrados.map((item) => (
                    <tr 
                      key={item._id} 
                      className={item.status ? "bg-green-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.pendiente}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{item.detalle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium ${new Date(item.dia) < new Date() && !item.status ? "text-red-600" : "text-gray-900"}`}>
                          {formatearFecha(item.dia)}
                          {new Date(item.dia) < new Date() && !item.status && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Atrasado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700">{item.telefono}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleChangeStatus(item._id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.status 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                        >
                          {item.status ? "Completado" : "Pendiente"}
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

      <style jsx>{`
        .stats-card {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          min-width: 120px;
          text-align: center;
        }
        .stats-card span:first-child {
          display: block;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Pendientes;