import { Circle, Divider, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { Tab, TabList } from "@chakra-ui/tabs";
import { useContext } from "react";
import { ContactContext } from "./ChatMain";

const Sidebar = () => {
    const { contactList } = useContext(ContactContext);
    return (
        <>
            <VStack py="1.4rem">
                <HStack justify="space-evenly" w="100%">
                    <Heading size="md">Contacts</Heading>
                </HStack>
                <Divider />
                <VStack as={TabList}>
                    {contactList.map(contact => (
                        <HStack as={Tab} key={`Contact:${contact}`}>
                            <Circle bg={"" + contact.connected === "true" ? "green.700" : "red.500"} w="10px" h="10px" />
                            <Text>{contact.username}</Text>
                        </HStack>
                    ))}
                </VStack>
            </VStack>
        </>
    );
};

export default Sidebar;