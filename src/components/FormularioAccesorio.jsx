import { useEffect, useState } from "react";
import { categorias, handleMessage } from "../helpers/index";
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import Error from "./Error";
import { toast } from "sonner";
import { addAccesorio } from "../API/events";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const FormularioAccesorio = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_original: "",
    stock: "",
    categoria: "",
    activo: 1,
    imagen: ""
  });
  const [imagenPreviw, setImagenPreview] = useState(null);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarAlerta, alerta, setReload } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nombre' || name === 'descripcion' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    setIsLoading(true);

    // Validación de campos requeridos
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
      mostrarAlerta({
        msg: "Los campos marcados con * son obligatorios",
        error: true,
      });
      setDisable(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await addAccesorio(
        formData.nombre,
        formData.descripcion,
        formData.precio,
        formData.precio_original,
        formData.stock,
        formData.categoria,
        formData.activo,
        formData.imagen
      );

      if (response.status === "success") {
        await Swal.fire({
          title: '¡Éxito!',
          text: response.mensaje,
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        
        // Resetear formulario
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          precio_original: "",
          stock: "",
          categoria: "",
          activo: 1,
          imagen: ""
        });
        setImagenPreview(null);
        setReload(true);
        navigate('/accesorios');
      } else {
        throw new Error(response.mensaje);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    } finally {
      setDisable(false);
      setIsLoading(false);
    }
  };

  // Función para convertir imagen a base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    // Add size validation (e.g., 2MB limit)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_SIZE) {
      toast.error('La imagen es demasiado grande. Máximo 2MB permitido.');
      return;
    }
    
    setImagenPreview(URL.createObjectURL(file));
    
    try {
      const base64 = await convertBase64(file);
      setFormData(prev => ({ ...prev, imagen: base64 }));
    } catch (error) {
      toast.error('Error al procesar la imagen');
    }
  }
};

  const UploadInput = () => (
    <div className="space-y-4">
      {imagenPreviw ? (
        <div className="relative">
          <button
            className="absolute -right-2 -top-2 z-10 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={() => {
              setFormData(prev => ({ ...prev, imagen: "" }));
              setImagenPreview(null);
            }}
          >
            ×
          </button>
          <img 
            className="w-full h-64 object-contain rounded-lg border border-gray-200" 
            src={imagenPreviw} 
            alt="Vista previa" 
          />
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click para subir imagen</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG o JPEG (MAX. 5MB)</p>
          </div>
          <input 
            onChange={handleImageChange}
            type="file" 
            className="hidden" 
            accept="image/*"
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800">
            <h2 className="text-2xl font-bold text-white">
              {id ? "Editar Producto" : "Nuevo Accesorio"}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">
                {id ? "Actualizando producto..." : "Guardando accesorio..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {alerta.msg && <Error alerta={alerta} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nombre"
                    type="text"
                    className={`block w-full px-4 py-2 rounded-md border ${alerta.msg && !formData.nombre ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                {/* Precio Original */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Original
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      name="precio_original"
                      type="number"
                      className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.precio_original}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Precio Público */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Público <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      name="precio"
                      type="number"
                      className={`block w-full pl-7 pr-12 py-2 rounded-md border ${alerta.msg && !formData.precio ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.precio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="stock"
                    type="number"
                    className={`block w-full px-4 py-2 rounded-md border ${alerta.msg && !formData.stock ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className={`${alerta.msg && !formData.categoria ? 'border-red-500 border-2' : ''}`}
                    options={categorias}
                    onChange={(selected) => 
                      setFormData(prev => ({ ...prev, categoria: selected.value }))
                    }
                    placeholder="Seleccione una categoría..."
                    noOptionsMessage={() => "No hay opciones disponibles"}
                  />
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Producto
                </label>
                <UploadInput />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/accesorios')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={disable}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {id ? "Actualizar Producto" : "Agregar Accesorio"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioAccesorio;