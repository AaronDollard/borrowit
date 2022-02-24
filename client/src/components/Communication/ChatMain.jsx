import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, useState, useContext } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import useSocketSetup from "../../Socket/useSocketSetup";
import { SocketContext } from "../Views";

export const ContactContext = createContext("");
export const MessagesContext = createContext();

const ChatMain = () => {
    const { socket } = useContext(SocketContext);

    const [contactList, setContactList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [contactIndex, setContactIndex] = useState(0);

    useSocketSetup(setContactList, setMessages, socket);

    return (
        <ContactContext.Provider value={{ contactList, setContactList }}>
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
        </ContactContext.Provider >
    );
};

export default ChatMain;