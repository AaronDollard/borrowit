import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, useState, useContext, useEffect } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import useSocketSetup from "../../Socket/useSocketSetup";
import { AccountContext } from "../Contexts/AccountContext";
import socketConnection from "../../Socket/socket";


// export const SocketContext = createContext();
export const ContactContext = createContext("");
export const MessagesContext = createContext();

const ChatMain = () => {
    const { user } = useContext(AccountContext)
    const [contactList, setContactList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [contactIndex, setContactIndex] = useState(0);
    const [socket, setSocket] = useState(() => socketConnection(user));

    useEffect(() => {
        setSocket(() => socketConnection(user));
    }, []);

    useSocketSetup(setContactList, setMessages, socket);


    return (
        <ContactContext.Provider value={{ contactList, setContactList }}>
            {/* <SocketContext.Provider value={{ socket }}> */}
            <Grid templateColumns="repeat(10, 1fr)"
                h='90vh'
                as={Tabs}
                onChange={(index => setContactIndex(index))}>

                <GridItem colSpan="3" borderRight="1px solid gray">
                    <Sidebar />
                </GridItem>

                <GridItem colSpan="7" maxH="90vh">
                    <MessagesContext.Provider value={{ messages, setMessages }}>
                        <Chat userid={contactList[contactIndex]?.userid} />
                    </MessagesContext.Provider>
                </GridItem>
            </Grid>
            {/* </SocketContext.Provider> */}
        </ContactContext.Provider >
    );
};

export default ChatMain;