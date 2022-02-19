import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { HStack } from "@chakra-ui/layout";
import { Field, Formik, Form } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import socket from "../../Socket/socket";
import { MessagesContext } from "./ChatMain";

const Chatbox = ({ userid }) => {
    const { setMessages } = useContext(MessagesContext);

    return (
        <Formik
            initialValues={{ message: "" }}
            validationSchema={Yup.object({
                message: Yup.string().min(1).max(255),
            })}
            onSubmit={(values, actions) => {
                const message = { to: userid, from: null, content: values.message };
                socket.emit("dm", message);
                setMessages(prevMsgs => [message, ...prevMsgs]);
                actions.resetForm();
            }}
        >
            <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
                <Input
                    as={Field}
                    name="message"
                    placeholder="Type your message here..."
                    size="lg" autoComplete="off" />

                <Button type="submit" size="lg" colorScheme="teal">Send</Button>
            </HStack>
        </Formik>
    );
};

export default Chatbox