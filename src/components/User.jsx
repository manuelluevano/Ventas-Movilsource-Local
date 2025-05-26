/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { MdModeEdit, MdCheck, MdClose, MdCameraAlt } from "react-icons/md";

const User = ({ tokenUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: tokenUser.name || "",
    lastname: tokenUser.lastname || "",
    email: tokenUser.email || "",
    photo: tokenUser.photo || "https://img.freepik.com/premium-vector/icono-perfil-simple-color-blanco-icon_1076610-50204.jpg" // URL de imagen por defecto
  });
  const fileInputRef = useRef(null);
console.log("Datops user", tokenUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData({
      name: tokenUser.name || "",
      lastname: tokenUser.lastname || "",
      email: tokenUser.email || "",
      photo: tokenUser.photo || "https://img.freepik.com/premium-vector/icono-perfil-simple-color-blanco-icon_1076610-50204.jpg"
    });
    setEditMode(false);
  };

  async function handleSave() {
    try {
      // Aquí iría la lógica para guardar los cambios incluyendo la foto
      // await updateUserData(formData);
      setEditMode(false);
      // Mostrar notificación de éxito
    } catch (error) {
      console.error("Error al guardar:", error);
      // Mostrar notificación de error
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Mis Datos</h2>
            {!editMode && (
              <button
                onClick={handleEdit}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <MdModeEdit className="mr-1" /> Editar
              </button>
            )}
          </div>

          {/* Sección de Foto de Perfil */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img 
                src={formData.photo} 
                alt="Foto de perfil" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {editMode && (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
                  >
                    <MdCameraAlt size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            {!editMode && (
              <p className="mt-3 text-lg font-medium text-gray-700">
                {formData.name} {formData.lastname}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Campo Nombre */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">Nombre</label>
              {editMode ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 py-2 px-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="py-2 px-1 text-gray-800">{formData.name}</p>
              )}
            </div>

            {/* Campo Apellido */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">Apellido</label>
              {editMode ? (
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 py-2 px-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="py-2 px-1 text-gray-800">{formData.lastname}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">Email</label>
              {editMode ? (
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 py-2 px-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="py-2 px-1 text-gray-800">{formData.email}</p>
              )}
            </div>

            {/* Botones en modo edición */}
            {editMode && (
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                >
                  <MdClose className="mr-1" /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <MdCheck className="mr-1" /> Guardar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;