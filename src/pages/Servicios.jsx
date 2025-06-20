import { useEffect, useState } from "react";
import { addService, listServices, updateServiceStatus } from "../API/events";
import FormularioServicio from "../components/FormularioServicio";
import ListaServicios from "../components/ListaServicios";
import { toast, Toaster } from "sonner";

const Servicios = () => {
  const [listaServicios, setListaServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultimoFolio, setUltimoFolio] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await listServices();
        setListaServicios(response.servicios);

        // Calcular el último folio
        if (response.servicios.length > 0) {
          const folios = response.servicios.map(s => s.folio);
          const maxFolio = Math.max(...folios);
          setUltimoFolio(maxFolio);
        }
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError(err.message);
        toast.error('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
  
    fetchServices();
  }, []);

  // Manejar edición de servicio
  const handleEdit = (servicio) => {
    setEditingService(servicio);
    setShowForm(true);
  };

  // Manejar nuevo servicio
  const handleNewService = () => {
    setEditingService({}); // Objeto vacío en lugar de null
    setShowForm(true);
  };

  // Manejar eliminación de servicio
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        setLoading(true);
        await deleteService(id);
        setListaServicios(prev => prev.filter(servicio => servicio.id !== id));
        toast.success('Servicio eliminado correctamente');
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
        toast.error('Error al eliminar el servicio');
      } finally {
        setLoading(false);
      }
    }
  };

  // Manejar cambio de estado
  const handleStatusChange = async (servicioId, nuevoEstado) => {
    try {
      setLoading(true);
      await updateServiceStatus(servicioId, nuevoEstado);
      
      setListaServicios(prevServicios => 
        prevServicios.map(servicio => 
          servicio.id === servicioId ? { ...servicio, estado: nuevoEstado } : servicio
        )
      );
      
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error('Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmitServicio = async (formData) => {
    try {
      const result = await addService(formData);

      if (result.status === 'error') {
        const errorMessage = result.field 
          ? `${result.message} (Campo: ${result.field})`
          : result.message;
        
        toast.error(errorMessage);
        return;
      }

      toast.success(result.message || 'Servicio creado correctamente');
      setShowForm(false);
      
      // Recargar la lista de servicios después de un breve retraso
      setTimeout(() => {
        listServices().then(response => {
          setListaServicios(response.servicios);
          if (response.servicios.length > 0) {
            const folios = response.servicios.map(s => s.folio);
            setUltimoFolio(Math.max(...folios));
          }
        });
      }, 1000);

    } catch (error) {
      console.error('Error al crear servicio:', error);
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Error desconocido al crear servicio';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="container mx-auto px-0 py-6">
        {/* Header y botón de nuevo servicio */}
        <div className="flex justify-between items-center mb-6">
          {!showForm && (
            <button
              onClick={handleNewService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nuevo Servicio
            </button>
          )}
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col gap-6">
          {/* Mostrar formulario solo cuando showForm es true */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingService?.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FormularioServicio 
                onSubmit={handleSubmitServicio} 
                ultimoFolio={ultimoFolio}
                initialData={editingService || {}} // Asegurar que siempre sea un objeto
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Lista de servicios - Siempre visible */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ListaServicios  
              servicios={listaServicios}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onNewService={handleNewService}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicios;