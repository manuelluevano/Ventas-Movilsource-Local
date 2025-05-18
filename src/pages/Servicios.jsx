import { useEffect, useState } from "react";
import { addService, listServices, updateServiceStatus } from "../API/events";
import FormularioServicio from "../components/FormularioServicio";
import ListaServicios from "../components/ListaServicios";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Servicios = () => {
  const { tokenUser } = useAuth();
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
  }, []);

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
      const token = localStorage.getItem('token') || '';
      
      const result = await addService(
        formData.nombre,
        formData.apellido,
        formData.numero_contacto,
        formData.servicio,
        formData.modelo,
        formData.marca,
        formData.imei,
        formData.numero_serie,
        formData.precio_servicio,
        formData.abono_servicio,
        formData.folio,
        formData.gaveta,
        formData.observaciones,
        token,
        formData.fecha_registro
      );
      
      console.log('Servicio creado:', result);
      // Aquí puedes redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al crear servicio:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
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
      {tokenUser.id ? (
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
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default Servicios;