/* eslint-disable react/prop-types */

import Card from "./Card";

const ListCard = ({
  item,
  setLoading,
  loading, 
  setSearchTerm
}) => {
  // console.log("Total de lista de refacciones",refacciones);

  return (
    <>
      {item && item.length ? (
        <>
          {item.map((i) => {
            console.log(item);
            return (
              <Card
                key={i.id}
                item={i}
                setLoading={setLoading}
                loading={loading}
              />
            );
          })}
        </>
      ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8 animate-bounce">
                <div className="absolute w-16 h-16 border-4 border-gray-200 rounded-full left-0"></div>
                <div className="absolute w-3 h-8 bg-gray-200 right-3 bottom-0 transform rotate-45 origin-bottom"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No encontramos lo que buscas</h3>
            <button 
              className="px-4 mt-5 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </button>
          </div>


      )}
    </>
  );
};

export default ListCard;
