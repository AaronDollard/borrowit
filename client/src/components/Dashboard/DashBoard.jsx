import { StarIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Grid, GridItem, Heading, Image, Link, Stack, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Fragment } from 'react';
import { AccountContext } from '../Contexts/AccountContext';
import Modal from 'react-modal';


const Dashboard = () => {
    const [usersItems, setLoggedUserItems] = useState([]);
    const [incomingOffers, setIncomingOffers] = useState([]);
    const [outgoingOffers, setOutgoingOffers] = useState([]);

    const [offerstatusA, setStatusAccept] = useState("ACCEPTED");
    const [offerstatusD, setStatusDecline] = useState("DECLINED");
    const [offerstatusID, setStatusID] = useState("");
    const [buttonState, setbuttonState] = useState("");

    const { user, setUser } = useContext(AccountContext);
    const currentUserID = user.userid;

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    console.log(currentUserID, "Dashboard DEBUG")

    const getLoggedUserItems = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log("LOGGED USER BODY", body)
            console.log("LOGGED USER RESPONSE", response)

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
            console.log("INCOMING OFFER BODY", body)
            console.log("INCOMING OFFER RESPONSE", response)

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
            console.log("OUTGOING OFFER BODY", body)
            console.log("OUTGOING OFFER RESPONSE", response)

            const outgoingOfferData = await response.json();
            setOutgoingOffers(outgoingOfferData);
            for (var i = 0; i < outgoingOfferData.length; i += 1) {
                console.log(outgoingOfferData[i]);
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    // function sleep(milliseconds) {
    //     return new Promise(resolve => setTimeout(resolve, milliseconds));
    // }

    const offerIDResponse = async (e) => {
        setStatusID(null);
        setStatusID(e);
    }

    const offerResponse = async (e) => {
        // await sleep(2000);
        console.log("Offer response made")
        console.log("Response made: e ", e)
        var responseToOffer = e;
        var responseToOfferID = offerstatusID;

        if (offerstatusID == "") {
            openModal(responseToOffer);
        }

        console.log("Offerstatusid: ", offerstatusID)
        try {
            const body = { responseToOffer, responseToOfferID };
            const response = await fetch("http://localhost:4000/auth/offerresponse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message)
        }
    }

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
                                        <Box mt='1' fontWeight='semibold' lineHeight='tight' isTruncated>Offer from <Link href={'/users/' + item.username}>{item.username}</Link></Box>
                                        <Box display='flex' mt='2' alignItems='center'>
                                            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                        </Box>
                                        <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                        <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                        <br />
                                        <Stack direction='row' spacing={4}>
                                            <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                            <Button
                                                onClick={e => {
                                                    offerIDResponse(item.offerid)
                                                    offerResponse(e.target.value)
                                                }} value={offerstatusA}>Accept
                                            </Button>

                                            <Button
                                                onClick={e => {
                                                    offerIDResponse(item.offerid)
                                                    offerResponse(e.target.value)
                                                }} value={offerstatusD}>Decline
                                            </Button>

                                        </Stack>
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
                                            <Box display='flex' mt='1' alignItems='right'>
                                                <Badge lineHeight='tight' colorScheme='orange' isTruncated>{item.offerstatus}</Badge>
                                            </Box>
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

            {/* An error can occur when responding to an offer, to try prevent mistakes from this error and catch it this modal has been implemented */}
            <Modal style={{ verlay: { width: '100%', height: "100%" }, content: { position: 'absolute', top: '40%', left: '20%', right: '20%', bottom: '40%', border: '1px solid #ccc' } }}
                isOpen={modalIsOpen} onRequestClose={closeModal}>
                <VStack spacing="1rem">
                    <Heading>Oops!</Heading>
                    <p>A small issue has occured. We're working hard on fixing this. Please try again.</p>
                    <button onClick={closeModal}>Okay</button>
                </VStack>
            </Modal>
        </div >
    )
}

export default Dashboard
