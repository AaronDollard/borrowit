import { createContext, useState, useEffect } from "react";

export const ProdDevMode = createContext();

const urlContext = ({ children }) => {
    const [baseURL, setBaseURL] = useState({});


    setBaseURL = process.env.NODE_ENV === 'production' ? "" : "http://localhost:4000";

    useEffect(() => {
    }, []);

    return <ProdDevMode.Provider value={{ baseURL, setBaseURL }}>
        {children}
    </ProdDevMode.Provider>
}

export default urlContext;