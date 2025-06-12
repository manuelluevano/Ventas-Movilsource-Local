import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import { listAccesorios } from "../API/events";
import { Toaster } from "sonner";
import { PacmanLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Accesorios = () => {
  const [accesorios, setAccesorios] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const { totalItems } = useCart();
  const { tokenUser } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await listAccesorios();
        
        if (!response.accesorios) {
          throw new Error('Error al obtener los productos');
        }
        setAccesorios(response.accesorios);
        setFilteredProducts(response.accesorios);
        
        // Calcular el precio máximo para el rango
        const maxPrice = Math.max(...response.accesorios.map(p => p.precio));
        setPriceRange([0, maxPrice]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [reload]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, accesorios, selectedCategories, priceRange, sortOption]);

  const filterProducts = () => {
    let results = [...accesorios];
    
    // Filtro por término de búsqueda
    if (searchTerm) {
      results = results.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtro por categoría
    if (selectedCategories.length > 0) {
      results = results.filter(product => 
        selectedCategories.includes(product.categoria)
      );
    }
    
    // Filtro por rango de precio
    results = results.filter(product => 
      product.precio >= priceRange[0] && product.precio <= priceRange[1]
    );
    
    // Ordenamiento
    switch(sortOption) {
      case "price-asc":
        results.sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        results.sort((a, b) => b.precio - a.precio);
        break;
      case "name-asc":
        results.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "name-desc":
        results.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }
    
    setFilteredProducts(results);
  };

  // Función para resetear todos los filtros
  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSortOption("default");
    
    // Resetear el rango de precio al máximo disponible
    const maxPrice = Math.max(...accesorios.map(p => p.precio));
    setPriceRange([0, maxPrice]);
    
    // Forzar un nuevo filtrado
    filterProducts();
  };

  // Obtener categorías únicas para los filtros
  const categories = [...new Set(accesorios.map(product => product.categoria).filter(Boolean))];

  if (!tokenUser.id) return <Navigate to="/login" />;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Botón Agregar */}
          <Link
            to="/FormularioAccesorio"
            className="w-full md:w-auto"
          >
            <button className="bg-movilsource hover:hover:bg-movilsource-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Producto
            </button>
          </Link>

          {/* Buscador */}
          <div className="w-full md:flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar accesorios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Carrito */}
          <Link to="/cart" className="w-full md:w-auto">
            <div className="relative flex items-center justify-center md:justify-end">
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Filtros y ordenamiento */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Botón para mostrar/ocultar filtros en móvil */}
            <button className="md:hidden flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
            
            {/* Ordenamiento */}
            <div className="w-full md:w-auto">
              <label htmlFor="sort" className="sr-only">Ordenar por</label>
              <select
                id="sort"
                className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>
            
            {/* Filtro por categoría */}
            {categories.length > 0 && (
              <div className="w-full md:w-auto">
                <label htmlFor="category" className="sr-only">Categoría</label>
                <select
                  id="category"
                  className="block w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !selectedCategories.includes(e.target.value)) {
                      setSelectedCategories([...selectedCategories, e.target.value]);
                    }
                  }}
                >
                  <option value="">Filtrar por categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Chips de categorías seleccionadas */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <span 
                    key={category} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                    <button 
                      type="button" 
                      className="ml-2 p-1 rounded-full hover:bg-blue-200"
                      onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button 
                  type="button" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedCategories([])}
                >
                  Limpiar
                </button>
              </div>
            )}
            
            {/* Filtro por rango de precio */}
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rango de precio: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

       <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <PacmanLoader color="#3B82F6" size={30} />
          </div>
        ) : (
          <ListCard
            item={filteredProducts}
            loading={loading}
            setSearchTerm={setSearchTerm}
            resetAllFilters={resetAllFilters}
          />
        )}
      </main>
    </div>
  );
};

export default Accesorios;