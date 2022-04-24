import { useContext, useEffect } from "react";
import { AccountContext } from "../components/Contexts/AccountContext";

const useSocketSetup = (setContactList, setMessages, socket) => {
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
            socket.off("contacts");
            socket.off("messages");
            socket.off('dm');
        };
    }, [setUser, setContactList, setMessages, socket]);
};

export default useSocketSetup;