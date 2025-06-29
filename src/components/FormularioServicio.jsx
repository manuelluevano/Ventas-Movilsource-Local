import React, { useState, useEffect } from 'react';
import Exhibidor from './Exhibidor';

const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const ServicioForm = ({ ultimoFolio, initialData = {}, onSubmit, onCancel }) => {
    const siguienteFolio = ultimoFolio !== null ? ultimoFolio + 1 : 1;
    const [errors, setErrors] = useState({});
    const [mostrarDisponibles, setMostrarDisponibles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formData, setFormData] = useState({
        folio: siguienteFolio || 0,
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        numero_contacto: initialData.numero_contacto || '',
        servicio: initialData.servicio || '',
        modelo: initialData.modelo || '',
        marca: initialData.marca || '',
        imei: initialData.imei || '',
        numero_serie: initialData.numero_serie || '',
        precio_servicio: initialData.precio_servicio || '',
        abono_servicio: initialData.abono_servicio || '',
        saldo_pendiente: initialData.saldo_pendiente || '',
        gaveta: initialData.gaveta || '',
        observaciones: initialData.observaciones || '',
        fecha_registro: initialData.fecha_registro || getCurrentDate(),
        fecha_entrega: initialData.fecha_entrega || '',
        estado: 'recibido',
        tiene_funda: initialData.tiene_funda || '',
        tiene_chip: initialData.tiene_chip || '',
        compania_chip: initialData.compania_chip || ''
    });

    const companiasMexicanas = [
        'Telcel',
        'Movistar',
        'AT&T México',
        'Unefón',
        'Virgin Mobile',
        'Bait',
        'Oui',
        'Weex'
    ];

    const handleSelectGaveta = (gavetaId) => {
        setFormData(prev => ({ ...prev, gaveta: gavetaId }));
    };

    useEffect(() => {
        if (formData.servicio === 'garantia' || formData.servicio === 'diagnostico') return;
        
        const precio = parseFloat(formData.precio_servicio) || 0;
        const abono = parseFloat(formData.abono_servicio) || 0;
        const saldo = precio - abono;
        
        setFormData(prev => ({
            ...prev,
            saldo_pendiente: saldo > 0 ? saldo.toFixed(2) : '0.00'
        }));
    }, [formData.precio_servicio, formData.abono_servicio, formData.servicio]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'numero_contacto') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            setErrors(prev => ({ 
                ...prev, 
                numero_contacto: numericValue.length !== 10 && numericValue.length > 0 
                    ? 'El número debe tener 10 dígitos' 
                    : null 
            }));
        } else if (name === 'nombre' || name === 'apellido') {
            const formattedValue = value.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        } else if (name === 'tiene_chip' && value === 'no') {
            // Si se selecciona "No" para chip, limpiar la compañía
            setFormData(prev => ({ 
                ...prev, 
                tiene_chip: value,
                compania_chip: '' 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        
        if (formData.numero_contacto.length !== 10) {
            setErrors(prev => ({ ...prev, numero_contacto: 'El número debe tener 10 dígitos' }));
            return;
        }

        const dataToSend = {
            ...formData,
            folio: siguienteFolio,
            fecha_entrega: formData.fecha_entrega || null
        };

        if (formData.servicio === 'garantia' || formData.servicio === 'diagnostico') {
            delete dataToSend.precio_servicio;
            delete dataToSend.abono_servicio;
            delete dataToSend.saldo_pendiente;
        } else {
            dataToSend.precio_servicio = parseFloat(formData.precio_servicio) || 0;
            dataToSend.abono_servicio = parseFloat(formData.abono_servicio) || 0;
            dataToSend.saldo_pendiente = parseFloat(formData.saldo_pendiente) || 0;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(dataToSend);
        } catch (error) {
            console.error('Error al guardar:', error);
            setSubmitError(error.message || 'Ocurrió un error al guardar el servicio');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header del formulario */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        {initialData.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </h2>
                    <button 
                        onClick={onCancel}
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-1 text-blue-100 text-sm">
                    Folio: #{siguienteFolio}
                </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 relative">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="mt-3 text-gray-700 font-medium">Procesando...</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sección Cliente */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Datos del Cliente
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                                    <input
                                        type="tel"
                                        name="numero_contacto"
                                        value={formData.numero_contacto}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border ${errors.numero_contacto ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                        required
                                        maxLength={10}
                                        placeholder="10 dígitos"
                                    />
                                    {errors.numero_contacto && (
                                        <p className="mt-1 text-sm text-red-600">{errors.numero_contacto}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Sección Dispositivo */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                Datos del Dispositivo
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Servicio*</label>
                                    <select
                                        name="servicio"
                                        value={formData.servicio}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    >
                                        <option value="">Seleccione un servicio</option>
                                        <option value="display">Display</option>
                                        <option value="bateria">Batería</option>
                                        <option value="software">Software</option>
                                        <option value="microfono">Micrófono</option>
                                        <option value="liberacion">Liberación de compañía</option>
                                        <option value="diagnostico">Diagnóstico</option>
                                        <option value="garantia">Garantía</option>
                                        <option value="otros">Otros</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca*</label>
                                    <input
                                        type="text"
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleChange}
                                        list="marcasCelulares"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <datalist id="marcasCelulares">
                                        <option value="Apple">Apple (iPhone)</option>
                                        <option value="Samsung">Samsung</option>
                                        <option value="Xiaomi">Xiaomi</option>
                                        <option value="OPPO">OPPO</option>
                                        <option value="vivo">vivo</option>
                                        <option value="realme">realme</option>
                                        <option value="Motorola">Motorola</option>
                                        <option value="Huawei">Huawei</option>
                                        <option value="OnePlus">OnePlus</option>
                                        <option value="Google">Google Pixel</option>
                                        <option value="TECNO">TECNO</option>
                                        <option value="Infinix">Infinix</option>
                                    </datalist>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo*</label>
                                    <input
                                        type="text"
                                        name="modelo"
                                        value={formData.modelo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">IMEI</label>
                                        <input
                                            type="text"
                                            name="imei"
                                            value={formData.imei}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                                        <input
                                            type="text"
                                            name="numero_serie"
                                            value={formData.numero_serie}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sección Accesorios */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                            Accesorios del Dispositivo
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campo para funda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">¿Incluye funda?</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="tiene_funda"
                                            value="si"
                                            checked={formData.tiene_funda === 'si'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700">Sí</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="tiene_funda"
                                            value="no"
                                            checked={formData.tiene_funda === 'no'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Campo para chip */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">¿Incluye chip?</label>
                                <div className="flex space-x-4 mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="tiene_chip"
                                            value="si"
                                            checked={formData.tiene_chip === 'si'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700">Sí</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="tiene_chip"
                                            value="no"
                                            checked={formData.tiene_chip === 'no'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-gray-700">No</span>
                                    </label>
                                </div>
                                
                                {formData.tiene_chip === 'si' && (
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Compañía del chip</label>
                                        <select
                                            name="compania_chip"
                                            value={formData.compania_chip}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Seleccione una compañía</option>
                                            {companiasMexicanas.map(compania => (
                                                <option key={compania} value={compania}>{compania}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Sección Servicio */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Detalles del Servicio
                        </h3>
                        
                        {formData.servicio !== 'garantia' && formData.servicio !== 'diagnostico' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio del Servicio ($)*</label>
                                    <input
                                        type="number"
                                        name="precio_servicio"
                                        value={formData.precio_servicio}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Abono ($)</label>
                                    <input
                                        type="number"
                                        name="abono_servicio"
                                        value={formData.abono_servicio}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Pendiente ($)</label>
                                    <input
                                        type="number"
                                        name="saldo_pendiente"
                                        value={formData.saldo_pendiente}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación del equipo*</label>
                            <div className="mt-1 flex rounded-lg shadow-sm">
                                <input
                                    type="text"
                                    name="gaveta"
                                    value={formData.gaveta}
                                    onChange={handleChange}
                                    className="flex-1 min-w-0 block w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    readOnly
                                    placeholder="Selecciona una gaveta"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMostrarDisponibles(!mostrarDisponibles);
                                    }}
                                    className={`inline-flex items-center px-4 py-2 border border-l-0 rounded-r-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        formData.gaveta 
                                            ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                            : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {formData.gaveta ? (
                                        <>
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Cambiar
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Seleccionar
                                        </>
                                    )}
                                </button>
                            </div>
                            <Exhibidor 
                                enFormulario={true} 
                                setMostrarDisponibles={setMostrarDisponibles} 
                                mostrarDisponibles={mostrarDisponibles}
                                onSelectGaveta={handleSelectGaveta}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro*</label>
                                <input
                                    type="date"
                                    name="fecha_registro"
                                    value={formData.fecha_registro}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                    readOnly
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega</label>
                                <input
                                    type="date"
                                    name="fecha_entrega"
                                    value={formData.fecha_entrega || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Detalles adicionales sobre el servicio"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={!formData.gaveta || isSubmitting}
                            type="submit"
                            className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                                !formData.gaveta || isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Servicio'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicioForm;