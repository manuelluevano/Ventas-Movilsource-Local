import FormularioRegistro from "../components/FormularioRegistro";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Register = () => {
  const { tokenUser } = useAuth();
  return (
    <>
      {tokenUser.id ? (
       <Navigate to='/'/>
      ) : (
        <div className="mt-20">
          <FormularioRegistro />
        </div>
      )}
    </>
  );
};

export default Register;
