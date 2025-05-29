import React, { useState, useEffect } from 'react';
import './Exhibidor.css';
import { listServices } from '../API/events';
import { FiSearch, FiX, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Exhibidor = ({enFormulario, setMostrarDisponibles, mostrarDisponibles, onSelectGaveta}) => {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const estados = [
    { id: 'recibido', label: 'Recibido', color: '#3b82f6' },
    { id: 'proceso', label: 'En Proceso', color: '#f59e0b' },
    { id: 'terminado', label: 'Terminado', color: '#8b5cf6' },
    { id: 'entregado', label: 'Entregado', color: '#10b981' },
    { id: 'cancelado', label: 'Cancelado', color: '#ef4444' }
  ];

  const getEstadoColor = (estado) => {
    const estadoObj = estados.find(e => e.id === estado);
    return estadoObj ? estadoObj.color : '#6b7280';
  };

  const fetchServicios = async () => {
    try {
      const response = await listServices();
      return response.servicios;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const getGavetasDisponibles = () => {
    return espacios.filter(espacio => !espacio.ocupado).map(espacio => ({
      id: espacio.id,
      bloque: espacio.bloque,
      numero: espacio.numero
    }));
  };

  const espaciosFiltrados = espacios.filter(espacio => {
    // Filtro por búsqueda
    const matchesSearch = searchTerm === '' || 
      espacio.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (espacio.ocupado && (
        espacio.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        espacio.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Filtro por estado
    const matchesEstado = !filtroEstado || 
      (espacio.ocupado && espacio.estado === filtroEstado);
    
    return matchesSearch && matchesEstado;
  });

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
          fechaAsignacion: new Date(servicio.fecha_registro).toLocaleDateString(),
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
      const espaciosBloque = espaciosFiltrados
        .filter(e => e.bloque === letra)
        .sort((a, b) => b.numero - a.numero);
      
      if (espaciosBloque.length === 0) return null;
      
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
                className={`espacio ${espacio.ocupado ? 'ocupado' : 'libre'}`}
                onClick={() => espacio.ocupado && setDetalleVisible(espacio)}
                style={espacio.ocupado ? { 
                  borderLeft: `4px solid ${getEstadoColor(espacio.estado)}`,
                  backgroundColor: `${getEstadoColor(espacio.estado)}20`
                } : {}}
              >
                <div className="espacio-cabecera">
                  <span className="espacio-id">{espacio.id}</span>
                  {espacio.ocupado && (
                    <span 
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(espacio.estado) }}
                    >
                      {espacio.estado}
                    </span>
                  )}
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

  if (loading) return (
    <div className="cargando">
      <div className="spinner"></div>
      <p>Cargando exhibidor...</p>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <div className="error-icon">!</div>
      <p>Error al cargar los datos: {error}</p>
    </div>
  );

  return (
    <div className="exhibidor-container">
      {!enFormulario && ( 
        <div className="exhibidor-header">
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
          
          <div className="controles-busqueda">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar gaveta, equipo o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <div className="filtros-container">
              <button 
                className="btn-filtros"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <FiFilter />
                {filtroEstado ? 'Filtro activo' : 'Filtrar por estado'}
                {mostrarFiltros ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {mostrarFiltros && (
                <div className="filtros-dropdown">
                  <button
                    className={`filtro-option ${!filtroEstado ? 'active' : ''}`}
                    onClick={() => setFiltroEstado(null)}
                  >
                    Todos los estados
                  </button>
                  {estados.map(estado => (
                    <button
                      key={estado.id}
                      className={`filtro-option ${filtroEstado === estado.id ? 'active' : ''}`}
                      onClick={() => setFiltroEstado(estado.id)}
                      style={{ color: estado.color }}
                    >
                      {estado.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarDisponibles && (
        <div className="lista-disponibles">
          <div className="lista-disponibles-header">
            <h3>Gavetas Disponibles</h3>
            <button 
              className="btn-cerrar-lista"
              onClick={() => setMostrarDisponibles(false)}
            >
              <FiX />
            </button>
          </div>
          <div className="disponibles-grid">
            {getGavetasDisponibles().map(gaveta => (
              <div
                key={gaveta.id}
                className="gaveta-item"
                onClick={() => {
                  if (onSelectGaveta) {
                    onSelectGaveta(gaveta.id);
                  }
                  setMostrarDisponibles(false);
                }}
              >
                {gaveta.id}
              </div>
            ))}
          </div>
        </div>
      )}

      {!enFormulario && ( 
        <div className="columnas-container">
          {generarColumnas().filter(col => col !== null)}
        </div> 
      )}

      {detalleVisible && (
        <div className="modal-detalle" onClick={() => setDetalleVisible(null)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button 
              className="btn-cerrar-modal"
              onClick={() => setDetalleVisible(null)}
            >
              <FiX />
            </button>
            
            <h3>Detalles de la gaveta {detalleVisible.id}</h3>
            
            <div className="detalle-grid">
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
                <p 
                  className="estado-text"
                  style={{ 
                    backgroundColor: `${getEstadoColor(detalleVisible.estado)}20`,
                    color: getEstadoColor(detalleVisible.estado)
                  }}
                >
                  {detalleVisible.estado}
                </p>
              </div>
              <div className="detalle-item">
                <label>Fecha registro:</label>
                <p>{detalleVisible.fechaAsignacion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exhibidor;