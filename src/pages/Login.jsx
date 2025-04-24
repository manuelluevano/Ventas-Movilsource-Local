import { Navigate } from "react-router-dom";
import FormularioLogin from "../components/FormularioLogin";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { tokenUser } = useAuth();
  return (
    <>
      {!tokenUser.id ? (
        <div className="mt-20">
          <FormularioLogin />
        </div>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
};

export default Login;
