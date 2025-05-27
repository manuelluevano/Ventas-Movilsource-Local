import { useState, useEffect } from "react";
import commitInfo from "../commit-info.json";

export const VersionInfo = () => {
  const [visible, setVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    try {
      setLastUpdate(new Date(commitInfo.buildDate).toLocaleString());
    } catch (error) {
      console.error("Error al cargar commit info:", error);
    }
  }, []);

  if (!commitInfo) return null;

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Mostrar información de versión"
      >
        {visible ? '×' : 'i'}
      </button>
      
      {visible && (
        <div className="fixed bottom-16 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-xs z-50">
          <strong className="block text-lg mb-2">Cambios recientes</strong>
          <p className="text-sm mb-3">{commitInfo.message}</p>
          
          <div className="text-xs text-gray-500 space-y-1">
            <div>Versión: {commitInfo.version}</div>
            <div>Commit: {commitInfo.hash}</div>
            <div>Fecha: {new Date(commitInfo.date).toLocaleDateString()}</div>
            <div>Autor: {commitInfo.author}</div>
            {lastUpdate && <div>Actualizado: {lastUpdate}</div>}
          </div>
        </div>
      )}
    </>
  );
};