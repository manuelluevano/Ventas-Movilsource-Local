import { useState, useEffect } from 'react';
import commitInfo from '../../commit-info.json';

export const VersionInfo = () => {
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      <button 
        onClick={() => setVisible(!visible)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          visible ? 'bg-rose-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50`}
        aria-label={visible ? 'Ocultar información' : 'Mostrar información de versión'}
      >
        {visible ? '×' : 'i'}
      </button>
      
      {/* Panel desplegable */}
      <div className={`absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Información de Versión</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Versión</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-300">{commitInfo.version}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Commit</span>
              <span className="font-mono text-gray-700 dark:text-gray-300">{commitInfo.hash}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Rama</span>
              <span className="font-mono text-gray-700 dark:text-gray-300">{commitInfo.branch}</span>
            </div>
            
            <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Mensaje</div>
              <div className="text-gray-700 dark:text-gray-300 italic">{commitInfo.message}</div>
            </div>
            
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Autor</span>
              <span className="text-gray-700 dark:text-gray-300">{commitInfo.author}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Fecha Commit</span>
              <span className="text-gray-700 dark:text-gray-300">{formatDate(commitInfo.date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Última Build</span>
              <span className="text-gray-700 dark:text-gray-300">{formatDate(commitInfo.buildDate)}</span>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Entorno</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                commitInfo.environment === 'production' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {commitInfo.environment}
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
          Actualizado automáticamente con cada commit
        </div>
      </div>
    </div>
  );
};

export default VersionInfo;