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

  useEffect(() => {
    console.log('useEffect se ejecutó');
    
    const fetchProducts = async () => {
      try {
        console.log('Antes de llamar a listServices');
        const response = await listServices();
        console.log('Respuesta recibida:', response.servicios);
        setListaServicios(response.servicios);

        // Calcular el último folio
        if (response.servicios.length > 0) {
          const folios = response.servicios.map(s => s.folio);
          const maxFolio = Math.max(...folios);
          setUltimoFolio(maxFolio);
        }
      } catch (err) {
        console.error('Error en fetchProducts:', err);
        setError(err.message);
      } finally {
        console.log('Finalizó la carga');
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [ListaServicios]);

  // Manejar edición de servicio
  const handleEdit = (servicio) => {
    console.log('Editar servicio:', servicio);
  };

  // Manejar eliminación de servicio
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        setLoading(true);
        await deleteService(id);
        setListaServicios(prev => prev.filter(servicio => servicio.id !== id));
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

 const handleStatusChange = async (servicioId, nuevoEstado) => {
  try {
    // Mostrar indicador de carga
    setLoading(true);
    
    
    // Actualizar en el backend
    const response = await updateServiceStatus(servicioId, nuevoEstado);
    
    console.log(response);
    
    // Actualizar en el estado local solo si el backend responde correctamente
    setListaServicios(prevServicios => 
      prevServicios.map(servicio => 
        servicio.id === servicioId ? { ...servicio, estado: nuevoEstado } : servicio
      )
    );
    
    // Mostrar notificación de éxito
    toast.success('Estado actualizado correctamente');
    
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    setError(error.message);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

const handleSubmitServicio = async (formData) => {
    try {
        const result = await addService(formData);

        // Verificar el estado de la respuesta
        if (result.status === 'error') {
            // Construir mensaje de error (incluye campo si existe)
            const errorMessage = result.field 
                ? `${result.message} (Campo: ${result.field})`
                : result.message;
            
            // Mostrar error - asegúrate que toast.error esté importado/configurado correctamente
            toast.error(errorMessage, {
                style: {
                    background: '#ffebee',
                    color: '#d32f2f',
                    border: '1px solid #ef9a9a'
                }
            });
            
            // Resaltar el campo con error en el formulario
            if (result.field) {
                // Ejemplo para Formik:
                // formik.setFieldError(result.field, result.message);
                console.error(`Campo con error: ${result.field}`);
            }
            return;
        }

        // Éxito
        console.log('Servicio creado:', result.service);
        toast.success(result.message || 'Servicio creado correctamente', {
            style: {
                background: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #a5d6a7'
            }
        });

        // Recargar después de 2 segundos (solo en éxito)
        setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
        console.error('Error en la petición:', error);
        const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error desconocido al crear servicio';
        
        toast.error(errorMessage, {
            style: {
                background: '#ffebee',
                color: '#d32f2f',
                border: '1px solid #ef9a9a'
            }
        });
    }
};

  return (
    <>
      <Toaster
        toastOptions={{
          style: { background: "green", color: "white" },
          className: "my-toast",
          descriptionClassName: "my-toast-description",
        }}
      />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Formulario - Ocupa 1/3 del espacio en pantallas grandes */}
            <div className="lg:w-1/3 xl:w-1/4">
              <div className="sticky top-6">
                <FormularioServicio  onSubmit={handleSubmitServicio} ultimoFolio={ultimoFolio} />
              </div>
            </div>
        
            {/* Lista de servicios - Ocupa 2/3 del espacio en pantallas grandes */}
            <div className="lg:w-2/3 xl:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <ListaServicios  
                  servicios={listaServicios}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <Navigate to="/login" /> */}
      
    </>
  );
};

export default Servicios;