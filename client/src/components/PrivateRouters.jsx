import { AccountContext } from "./Contexts/AccountContext";
import { useContext } from "react";
import { useLocation } from "react-router";

const { Outlet, Navigate } = require("react-router")

//If the user exists and is logged in
const useAuth = () => {
    const { user } = useContext(AccountContext)
    return user && user.loggedIn;
}

//Users not logged in will be routed to login page
const PrivateRoutes = () => {
    const location = useLocation(); //Uses the path a user is in. 
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
};

export default PrivateRoutes;