import { useContext, useEffect } from "react";
import socket from "./socket";
import { AccountContext } from "../components/Contexts/AccountContext";

const useSocketSetup = (setContactList, setMessages) => {
    const { setUser } = useContext(AccountContext);

    useEffect(() => {
        socket.connect();
        socket.on("contacts", contactList => {
            setContactList(contactList);
        });

        socket.on("messages", messages => {
            setMessages(messages);
        });

        socket.on("connected", (status, username) => {
            setContactList(prevContacts => {
                return [...prevContacts].map(contact => {
                    if (contact.username === username) {
                        contact.connected = status;
                    }
                    return contact;
                });
            });
        });

        socket.on("dm", message => {
            setMessages(prevMsgs => [message, ...prevMsgs]);
        });


        socket.on("connect_error", () => {
            setUser({ loggedIn: false });
        });

        return () => {
            socket.off("connect_error");
            socket.off("connected");
            socket.off("friends");
            socket.off("messages");
        };
    }, [setUser, setContactList, setMessages]);
};

export default useSocketSetup;