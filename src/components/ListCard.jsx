/* eslint-disable react/prop-types */
import Card from "./Card";

const ListCard = ({ item, setSearchTerm, resetAllFilters }) => {
  return (
    <div className="min-h-screen">
      {item && item.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
          {item.map((i) => (
            <Card key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg
                className="w-full h-full text-gray-300 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No encontramos resultados
            </h3>
            <p className="text-gray-500 mb-6">
              Lo sentimos, no encontramos productos que coincidan con tu búsqueda.
              Intenta con otros términos o revisa la ortografía.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
              onClick={resetAllFilters}
            >
              Mostrar todos los productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCard;