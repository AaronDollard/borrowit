import { StarIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Grid, GridItem, Heading, Image, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Fragment } from 'react';
import { AccountContext } from '../Contexts/AccountContext';


const Dashboard = () => {
    const [usersItems, setLoggedUserItems] = useState([]);
    const [incomingOffers, setIncomingOffers] = useState([]);
    const [outgoingOffers, setOutgoingOffers] = useState([]);

    const { user, setUser } = useContext(AccountContext);
    const currentUserID = user.userid;
    console.log(currentUserID, "Dashboard DEBUG")

    const getLoggedUserItems = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(body)
            console.log(response)

            const userItemData = await response.json();
            setLoggedUserItems(userItemData);
            for (var i = 0; i < userItemData.length; i += 1) {
                console.log(userItemData[i]); //Print all of the items to the console for debugging
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    const getIncomingOffers = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myincomingitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(body)
            console.log(response)

            const incomingOfferData = await response.json();
            setIncomingOffers(incomingOfferData);
            for (var i = 0; i < incomingOfferData.length; i += 1) {
                console.log(incomingOfferData[i]);
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    const getOutgoingOffers = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myoutgoingitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(body)
            console.log(response)

            const outgoingOfferData = await response.json();
            setOutgoingOffers(outgoingOfferData);
            for (var i = 0; i < outgoingOfferData.length; i += 1) {
                console.log(outgoingOfferData[i]);
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        getLoggedUserItems();
        getIncomingOffers();
        getOutgoingOffers();
    }, []);


    return (
        <div>
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionButton><Heading>Your listings</Heading><AccordionIcon /></AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
                            {usersItems.map(item => (
                                <Fragment>
                                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                        <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
                                        <Box display='flex' mt='2' alignItems='center'>
                                            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                            <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                        </Box>
                                        <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                        <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                        <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                        <br />
                                        <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                    </GridItem>
                                </Fragment>
                            ))
                            }
                        </Grid >
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton><Heading>Incoming Offers</Heading><AccordionIcon /></AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
                            {incomingOffers.map(item => (
                                <Fragment>
                                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                        {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                        <Box display='flex' mt='2' alignItems='center'>
                                            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                            <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                        </Box>
                                        <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                        <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                        <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                        <br />
                                        <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                    </GridItem>
                                </Fragment>
                            ))
                            }
                        </Grid >
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton><Heading>Outgoing Offers</Heading><AccordionIcon /></AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                        {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                        <Box display='flex' mt='2' alignItems='center'>
                                            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                            <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                        </Box>
                                        <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                        <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                        <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                        <br />
                                        <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                    </GridItem>
                                </Fragment>
                            ))
                            }
                        </Grid >
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Dashboard
