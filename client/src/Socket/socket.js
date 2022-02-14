import { io } from "socket.io-client";
import { urlContext } from '../components/Contexts/ProdDevMode';
const { baseURL, setBaseURL } = useContext(urlContext);


const socket = new io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;