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
    <div className="version-info-container">
      <button 
        onClick={() => setVisible(!visible)}
        className="version-info-button"
        aria-label="Toggle version info"
      >
        {visible ? '×' : 'v'}
      </button>
      
      {visible && (
        <div className="version-info-popup">
          <h3>Información de Versión</h3>
          <div className="version-details">
            <p><strong>Versión:</strong> {commitInfo.version}</p>
            <p><strong>Commit:</strong> {commitInfo.hash}</p>
            <p><strong>Rama:</strong> {commitInfo.branch}</p>
            <p><strong>Mensaje:</strong> {commitInfo.message}</p>
            <p><strong>Autor:</strong> {commitInfo.author}</p>
            <p><strong>Fecha Commit:</strong> {formatDate(commitInfo.date)}</p>
            <p><strong>Última Build:</strong> {formatDate(commitInfo.buildDate)}</p>
            <p><strong>Entorno:</strong> {commitInfo.environment}</p>
          </div>
        </div>
      )}
    </div>
  );
};



export default VersionInfo;