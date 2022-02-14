import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
//import { ProdDevMode } from '../Contexts/ProdDevMode';

export const AccountContext = createContext();

const UserContext = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ loggedIn: null });
    //const { baseURL, setBaseURL } = useContext(ProdDevMode);

    const baseURL = process.env.NODE_ENV === 'production' ? "" : "http://localhost:4000";

    useEffect(() => {
        fetch(baseURL + "/auth/login", {
            credentials: "include",
        })
            .catch(err => {
                setUser({ loggedIn: false });
                return;
            })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    setUser({ loggedIn: false });
                    return;
                }
                return r.json();
            }).then(data => {
                if (!data) {
                    setUser({ loggedIn: false });
                    return;
                } //Return JSON data when the user is successful in logging in and nav to home
                setUser({ ...data })
                // navigate("/home");
            });
    }, []);

    return <AccountContext.Provider value={{ user, setUser }}>
        {children}
    </AccountContext.Provider>
}

export default UserContext;