import { createContext, useState, useEffect, useContext } from "react";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({ loggedIn: null, token: localStorage.getItem("token") });

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
            credentials: "include",
            headers: {
                authorization: `Bearer ${user.token}`,
            },
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