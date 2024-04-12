/* eslint-disable react/prop-types */
import { PacmanLoader } from "react-spinners";
import Card from "./Card";

const ListCard = ({ item, setLoading }) => {
  // console.log("Total de lista de refacciones",refacciones);

  return (
    <>
      {item && item.length ? (
        <>
          {item.map((item) => {
            // console.log(item);
            return (
              <>
                <Card item={item} setLoading={setLoading} />
              </>
            );
          })}
        </>
      ) : (
        <PacmanLoader
          size={40}
          color={"#cc6b03"}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </>
  );
};

export default ListCard;
