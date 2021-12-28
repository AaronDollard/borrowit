import { AccountContext } from "./Contexts/AccountContext";
import { useContext } from "react";

const { Outlet, Navigate } = require("react-router")

//If the user exists and is logged in
const useAuth = () => {
    const { user } = useContext(AccountContext)
    return user && user.loggedIn;
}

//Users not logged in will be routed to login page
const PrivateRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;