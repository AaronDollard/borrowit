import { StarIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Grid, GridItem, Heading, HStack, Image, Link, Stack, VStack } from '@chakra-ui/react';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AccountContext } from '../Contexts/AccountContext';
import Modal from 'react-modal';

const Dashboard = () => {
    const [usersItems, setLoggedUserItems] = useState([]);
    const [incomingOffers, setIncomingOffers] = useState([]);
    const [outgoingOffers, setOutgoingOffers] = useState([]);

    const [offerstatusA, setStatusAccept] = useState("ACCEPTED");
    const [offerstatusD, setStatusDecline] = useState("DECLINED");

    const [offerDismissed, setofferDismissed] = useState("DISMISSED");

    var offerstatusID = 0;
    const [counter, setcounter] = useState(1000);

    const [buttonState, setbuttonState] = useState("");


    const [incomingCount, setincomingCount] = useState("");
    const [outgoingCount, setoutgoingCount] = useState("");
    const [pendingCount, setpendingCount] = useState("");
    const [acceptedCount, setacceptedCount] = useState("");
    const [declinedCount, setdeclinedCount] = useState("");

    const [loaded, setLoaded] = useState("NOTLOADED");

    const { user, setUser } = useContext(AccountContext);
    const currentUserID = user.userid;

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }


    // console.log(currentUserID, "Dashboard DEBUG")
    const getLoggedUserItems = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            //console.log("LOGGED USER BODY", body)
            // console.log("LOGGED USER RESPONSE", response)

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
            // console.log("INCOMING OFFER BODY", body)
            // console.log("INCOMING OFFER RESPONSE", response)

            const incomingOfferData = await response.json();
            setIncomingOffers(incomingOfferData);
            // for (var i = 0; i < incomingOfferData.length; i += 1) {
            //     console.log(incomingOfferData[i]);
            // }
            setincomingCount(incomingOfferData.length);
        } catch (err) {
            console.error(err.message)
        }
        setLoaded("LOADED");
    };

    const getOutgoingOffers = async () => {
        try {
            var countPending = 0;
            var countAccepted = 0;
            var countDeclined = 0;

            const body = { currentUserID };
            const response = await fetch("http://localhost:4000/auth/myoutgoingitems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // console.log("OUTGOING OFFER BODY", body)
            // console.log("OUTGOING OFFER RESPONSE", response)

            const outgoingOfferData = await response.json();

            setOutgoingOffers(outgoingOfferData);

            for (var i = 0; i < outgoingOfferData.length; i += 1) {
                //console.log(outgoingOfferData[i]);

                if (outgoingOffers[i].offerstatus == "PENDING") {
                    countPending = countPending + 1;
                    console.log("PENDING", countPending)
                }

                if (outgoingOffers[i].offerstatus == "ACCEPTED") {
                    countAccepted = countAccepted + 1;
                    console.log("ACCEPTED", countAccepted)
                }

                if (outgoingOffers[i].offerstatus == "DECLINED") {
                    countDeclined = countDeclined + 1;
                    console.log("DECLINED", countDeclined)
                }
            }

            setpendingCount(countPending);
            setacceptedCount(countAccepted);
            setdeclinedCount(countDeclined);
            setoutgoingCount(outgoingOfferData.length);
            counter = outgoingOfferData.length;
        } catch (err) {
            console.error(err.message)
        }
    };

    const offerIDResponse = async (e) => {
        offerstatusID = e;
    }

    const negativeOne = async () => {
        setcounter(counter - 1)
    }

    const offerResponse = async (e) => {
        var responseToOffer = e;
        var responseToOfferID = offerstatusID;

        console.log("Offerstatusid: ", responseToOffer, responseToOfferID)
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

    const dismissOffer = async (e) => {
        var responseToOffer = e;
        var responseToOfferID = offerstatusID;

        console.log("Dismiss Offer: ", responseToOffer, responseToOfferID)
        try {
            const body = { responseToOffer, responseToOfferID };
            const response = await fetch("http://localhost:4000/auth/dismissoffer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

        } catch (err) {
            console.error(err.message)
        }
    };


    useEffect(() => {
        getLoggedUserItems();
        getOutgoingOffers(); //Wishlist
        getIncomingOffers();
    }, [loaded, counter]);

    return (
        <div>
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionButton><Heading fontFamily={"Dongle"}>My Catalog</Heading><AccordionIcon /></AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                            {usersItems.map(item => (
                                <Fragment>
                                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                        <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
                                        <Box padding={"10px"}>
                                            <Box display='flex' mt='2' alignItems='center'>
                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                                <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                            </Box>
                                            <Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                                <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                            </Box>
                                            <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                        </Box>
                                    </GridItem>
                                </Fragment>
                            ))
                            }
                        </Grid >
                    </AccordionPanel>
                </AccordionItem>



                <AccordionItem>
                    <AccordionButton>
                        <Heading fontFamily={"Dongle"}>Incoming Requests</Heading><AccordionIcon />

                        {incomingCount >= 1 && (
                            <Badge colorScheme='red'>Requests {incomingCount}</Badge>
                        )}

                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                            {incomingOffers.map(item => (
                                <Fragment>
                                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
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
                                                    negativeOne(counter)
                                                }} value={offerstatusA}>Accept
                                            </Button>

                                            <Button
                                                onClick={e => {
                                                    offerIDResponse(item.offerid)
                                                    offerResponse(e.target.value)
                                                    negativeOne(counter)
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
                    <AccordionButton>
                        <Heading fontFamily={"Dongle"}>Your Wishlist</Heading><AccordionIcon />
                        {pendingCount >= 1 && (
                            <Badge colorScheme='orange'>Pending {pendingCount}</Badge>
                        )}

                        {acceptedCount >= 1 && (
                            <Badge colorScheme='green'>Accepted {acceptedCount}</Badge>
                        )}

                        {declinedCount >= 1 && (
                            <Badge colorScheme='red'>Declined {declinedCount}</Badge>
                        )}
                    </AccordionButton>


                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus != "DISMISSED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box display='flex' mt='2' alignItems='center'>
                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                                <Box display='flex' mt='1' alignItems='right'>

                                                    {item.offerstatus == "PENDING" && (
                                                        <Badge colorScheme='orange'>{item.offerstatus}</Badge>
                                                    )}

                                                    {item.offerstatus == "ACCEPTED" && (
                                                        <Badge colorScheme='green'>{item.offerstatus}</Badge>
                                                    )}

                                                    {item.offerstatus == "DECLINED" && (
                                                        <Badge colorScheme='red'>{item.offerstatus}</Badge>
                                                    )}
                                                </Box>
                                            </Box>

                                            <Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                                <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                            </Box>


                                            {item.offerstatus == "PENDING" && (
                                                <Button ><Link href={'/browse/' + item.id}>View</Link></Button>
                                            )}

                                            {item.offerstatus == "ACCEPTED" && (

                                                <Stack direction='row' spacing={4}>
                                                    <Button >Contact</Button>
                                                    <Button >Complete</Button>
                                                </Stack>

                                            )}

                                            {item.offerstatus == "DECLINED" && (
                                                <Button onClick={e => {
                                                    offerIDResponse(item.offerid)
                                                    dismissOffer(e.target.value)
                                                    negativeOne(counter)
                                                }} value={offerDismissed}>Dismiss</Button>
                                            )}

                                        </GridItem>

                                    )}
                                </Fragment>
                            ))
                            }
                        </Grid >
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton><Heading fontFamily={"Dongle"}>Your History</Heading><AccordionIcon /></AccordionButton>
                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "DISMISSED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            <Box display='flex' mt='2' alignItems='center'>
                                                {item.offerstatus == "DISMISSED" && (
                                                    <Badge colorScheme='gray'>Declined</Badge>
                                                )}
                                            </Box>

                                            <Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                                <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
                                            </Box>

                                        </GridItem>
                                    )}

                                </Fragment>
                            ))
                            }
                        </Grid>
                    </AccordionPanel>
                </AccordionItem>

            </Accordion>

            {/* An error can occur when responding to an offer, to try prevent mistakes from this error and catch it this modal has been implemented */}
            <Modal style={{ overlay: { width: '100%', height: "100%" }, content: { position: 'absolute', top: '40%', left: '20%', right: '20%', bottom: '40%', border: '1px solid #ccc' } }}
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
