import { io } from "socket.io-client";
import { ProdDevMode } from '../components/Contexts/ProdDevMode';
const { baseURL, setBaseURL } = useContext(ProdDevMode);


const socket = new io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;