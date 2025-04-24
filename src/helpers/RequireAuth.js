// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// const RequireAuth = ({allowRoles}) => {
//     const location = useLocation()
//     const {tokenUser} = useAuth()

//     const content  = (
//         tokenUser.some(role => allowRoles.includes(role)) ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace/>

//     )
//     return content
// }

// export default RequireAuth