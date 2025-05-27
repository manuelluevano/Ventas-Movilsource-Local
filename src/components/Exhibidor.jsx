import React, { useState, useEffect } from 'react';
import './Exhibidor.css';
import { listServices } from '../API/events';

const Exhibidor = () => {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'recibido': return 'estado-recibido';
      case 'proceso': return 'estado-proceso';
      case 'terminado': return 'estado-terminado';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return 'estado-default';
    }
  };

  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(null);

  const fetchServicios = async () => {
    try {
      const response = await listServices();
      return response.servicios;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const espaciosIniciales = [];
      const bloques = ['A', 'B', 'C', 'D', 'E'];
      
      bloques.forEach(letra => {
        for (let i = 1; i <= 15; i++) {
          espaciosIniciales.push({
            id: `${letra}${i}`,
            bloque: letra,
            numero: i,
            ocupado: false,
            equipo: null,
            cliente: null,
            fechaAsignacion: null,
            servicio: null,
            estado: null
          });
        }
      });
      
      const servicios = await fetchServicios();
      
      const espaciosActualizados = espaciosIniciales.map(espacio => {
        const servicio = servicios.find(s => s.gaveta === espacio.id && !['entregado', 'cancelado'].includes(s.estado));
        
        return servicio ? {
          ...espacio,
          ocupado: true,
          equipo: `${servicio.marca} ${servicio.modelo}`,
          cliente: `${servicio.nombre} ${servicio.apellido}`,
          fechaAsignacion: servicio.fecha_registro,
          servicio: servicio.servicio,
          estado: servicio.estado
        } : espacio;
      });
      
      setEspacios(espaciosActualizados);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  const generarColumnas = () => {
    return ['A', 'B', 'C', 'D', 'E'].map(letra => {
      const espaciosBloque = espacios
        .filter(e => e.bloque === letra)
        .sort((a, b) => b.numero - a.numero);
      
      return (
        <div key={`columna-${letra}`} className="columna-bloque">
          <div className="header-bloque">
            <h3 className="titulo-bloque">Bloque {letra}</h3>
            <div className="contador-bloque">
              {espaciosBloque.filter(e => e.ocupado).length}/{espaciosBloque.length}
            </div>
          </div>
          <div className="espacios-columna">
            {espaciosBloque.map(espacio => (
              <div
                key={espacio.id}
                className={`espacio ${espacio.ocupado ? 'ocupado' : 'libre'} ${espacio.ocupado ? getEstadoColor(espacio.estado) : ''}`}
                onClick={() => espacio.ocupado && setDetalleVisible(espacio)}
              >
                <div className="espacio-cabecera">
                  <span className="espacio-id">{espacio.id}</span>
                  {espacio.ocupado && <span className="estado-badge">{espacio.estado}</span>}
                </div>
                {espacio.ocupado && (
                  <div className="espacio-contenido">
                    <div className="equipo">{espacio.equipo}</div>
                    <div className="cliente">{espacio.cliente}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  if (loading) return <div className="cargando">Cargando exhibidor...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="exhibidor-container">
      <div className="resumen-estado">
        <div className="contador">
          <span className="indicador libre"></span>
          <span>Libres: {espacios.filter(e => !e.ocupado).length}</span>
        </div>
        <div className="contador">
          <span className="indicador ocupado"></span>
          <span>Ocupados: {espacios.filter(e => e.ocupado).length}</span>
        </div>
      </div>
      
      <div className="columnas-container">{generarColumnas()}</div>

      {detalleVisible && (
        <div className="modal-detalle" onClick={() => setDetalleVisible(null)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <h3>Detalles del espacio {detalleVisible.id}</h3>
            <div className="detalle-item">
              <label>Equipo:</label>
              <p>{detalleVisible.equipo}</p>
            </div>
            <div className="detalle-item">
              <label>Cliente:</label>
              <p>{detalleVisible.cliente}</p>
            </div>
            <div className="detalle-item">
              <label>Servicio:</label>
              <p>{detalleVisible.servicio}</p>
            </div>
            <div className="detalle-item">
              <label>Estado:</label>
              <p className={`estado-text ${getEstadoColor(detalleVisible.estado)}`}>
                {detalleVisible.estado}
              </p>
            </div>
            <div className="detalle-item">
              <label>Fecha registro:</label>
              <p>{detalleVisible.fechaAsignacion}</p>
            </div>
            <button 
              className="btn-cerrar"
              onClick={() => setDetalleVisible(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exhibidor;