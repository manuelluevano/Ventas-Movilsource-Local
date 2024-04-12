
import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import User from "../components/User";

const Perfil = () => {

    const { tokenUser } = useAuth();


    return (
        <>
      {tokenUser.id ?  <div>
          <>
          <User tokenUser={tokenUser}/>
          <br/>
          </>
        </div> :  <Navigate to='/login'/>}
       
        </>
      );
}

export default Perfil