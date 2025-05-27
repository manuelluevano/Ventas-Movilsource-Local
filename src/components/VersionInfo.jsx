import { useState } from "react";

// Ejemplo con botón para mostrar/ocultar
export const VersionInfo = () => {
  const [visible, setVisible] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setVisible(!visible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg"
      >
        ¿
      </button>
      
      {visible && (
        <div className="fixed bottom-16 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-xs">
          <strong>Cambios recientes:</strong>
          <p className="text-sm mt-1">{commitInfo.message}</p>
          <div className="text-xs text-gray-500 mt-2">
            Versión: {commitInfo.version} | {commitInfo.date}
          </div>
        </div>
      )}
    </>
  );
};