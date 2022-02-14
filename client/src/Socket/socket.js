import { io } from "socket.io-client";
import { useContext } from 'react'
import { ProdDevMode } from '../components/Contexts/ProdDevMode';


const socket = () => {
    const { baseURL, setBaseURL } = useContext(ProdDevMode);


    const socket = new io(baseURL, {
        autoConnect: false,
        withCredentials: true,
    });
}

export default socket;