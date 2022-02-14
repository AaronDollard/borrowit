import { io } from "socket.io-client";

const baseURL = process.env.NODE_ENV === 'production' ? "" : "http://localhost:4000";


const socket = new io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;