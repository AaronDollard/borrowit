import { Text, VStack } from "@chakra-ui/layout";
import { TabPanel, TabPanels } from "@chakra-ui/tabs";
import { useContext, useEffect, useRef } from "react";
import Chatbox from "./Chatbox";
import { ContactContext, MessagesContext } from "./ChatMain";

const Chat = ({ userid }) => {
    const { contactList } = useContext(ContactContext);
    const { messages } = useContext(MessagesContext);
    const bottomDiv = useRef(null);

    useEffect(() => {
        bottomDiv.current?.scrollIntoView();
    });

    return contactList.length > 0 ? (
        <VStack h="100%" justify="end">
            <TabPanels overflowY="scroll">
                {contactList.map(contact => (
                    <VStack
                        flexDir="column-reverse"
                        as={TabPanel}
                        key={`chat:${contact.username}`}
                        w="100%"
                    >
                        <div ref={bottomDiv} />
                        {messages
                            .filter(
                                msg => msg.to === contact.userid || msg.from === contact.userid
                            )
                            .map((message, idx) => (
                                <Text
                                    m={
                                        message.to === contact.userid
                                            ? "1rem 0 0 auto !important"
                                            : "1rem auto 0 0 !important"
                                    }
                                    maxW="50%"
                                    key={`msg:${contact.username}.${idx}`}
                                    fontSize="lg"
                                    bg={message.to === contact.userid ? "blue.100" : "gray.100"}
                                    color="gray.800"
                                    borderRadius="10px"
                                    p="0.5rem 1rem"
                                >
                                    {message.content}
                                </Text>
                            ))}
                    </VStack>
                ))}
            </TabPanels>
            <Chatbox userid={userid} />
        </VStack>
    ) : (
        <VStack
            justify="center"
            pt="5rem"
            w="100%"
            textAlign="center"
            fontSize="lg"
        >
            <TabPanels>
                <TabPanel>
                    <Text>Nobody has contacted you about anything yet... 😭 <br /> Get lending and borrowing!</Text>
                </TabPanel>
            </TabPanels>
        </VStack>
    );
};

export default Chat;