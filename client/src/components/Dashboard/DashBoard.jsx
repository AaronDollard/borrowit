import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Checkbox, Grid, GridItem, Heading, HStack, Image, Link, Stack, Textarea, VStack } from '@chakra-ui/react';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AccountContext } from '../Contexts/AccountContext';
import { ContactContext } from "../Communication/ChatMain";
import { SocketContext } from '../Views';
import { useNavigate } from "react-router";
import { Radio, RadioGroup } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react"

//import socket from '../../Socket/socket';


const Dashboard = () => {
    const navigate = useNavigate();
    const [usersItems, setLoggedUserItems] = useState([]);
    const [incomingOffers, setIncomingOffers] = useState([]);
    const [outgoingOffers, setOutgoingOffers] = useState([]);

    const [offerstatusA, setStatusAccept] = useState("ACCEPTED");
    const [offerstatusD, setStatusDecline] = useState("DECLINED");
    const [offerDismissed, setofferDismissed] = useState("DISMISSED");
    const [offerReviewed, setofferReviewed] = useState("REVIEWED");
    const [reviewItem, setReviewItem] = useState("");
    const [reviewOwner, setReviewOwner] = useState("");
    const [reviewID, setReviewID] = useState("");
    const [reviewValue, setReviewValue] = React.useState('GOOD')
    const [reviewText, setReviewTextValue] = React.useState('')
    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setReviewTextValue(inputValue)
    }


    var offerstatusID = 0;

    // var reviewItem;
    // var reviewOwner;

    var [counter, setcounter] = useState(1000);
    //const [buttonState, setbuttonState] = useState("");

    const [incomingCount, setincomingCount] = useState("");
    const [outgoingCount, setoutgoingCount] = useState("");
    const [pendingCount, setpendingCount] = useState("");
    const [acceptedCount, setacceptedCount] = useState("");
    const [declinedCount, setdeclinedCount] = useState("");
    const [contactedCount, setcontactedCount] = useState("");
    const [countReviewed, setcountReviewed] = useState("");


    const { socket } = useContext(SocketContext);

    const [loaded, setLoaded] = useState("NOTLOADED");

    const { user } = useContext(AccountContext);
    var { setContactList } = useContext(ContactContext);

    const currentUserID = user.userid;


    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal(e) {
        setReviewOwner(e);
        setIsOpen(true);
    }

    const itemNameReview = async (e) => {
        setReviewItem(e);
    }
    const itemReviewID = async (e) => {
        setReviewID(e);
    }

    function closeModal() {
        setIsOpen(false);
    }

    console.log(currentUserID, "Dashboard DEBUG")
    const getLoggedUserItems = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/myitems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            //console.log("LOGGED USER BODY", body)
            // console.log("LOGGED USER RESPONSE", response)

            const userItemData = await response.json();
            setLoggedUserItems(userItemData);
            for (var i = 0; i < userItemData.length; i += 1) {
                // console.log(userItemData[i]); //Print all of the items to the console for debugging
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    const getIncomingOffers = async () => {
        try {
            const body = { currentUserID };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/myincomingitems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // console.log("INCOMING OFFER BODY", body)
            // console.log("INCOMING OFFER RESPONSE", response)

            const incomingOfferData = await response.json();
            setIncomingOffers(incomingOfferData);
            for (var i = 0; i < incomingOfferData.length; i += 1) {
                console.log(incomingOfferData[i]);
            }
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
            var countContacted = 0;

            const body = { currentUserID };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/myoutgoingitems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // console.log("OUTGOING OFFER BODY", body)
            console.log("OUTGOING OFFER RESPONSE", response)

            const outgoingOfferData = await response.json();

            setOutgoingOffers(outgoingOfferData);

            for (var i = 0; i < outgoingOfferData.length; i += 1) {
                console.log(outgoingOfferData[i]);

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

                if (outgoingOffers[i].offerstatus == "CONTACTED") {
                    countContacted = countContacted + 1;
                    console.log("CONTACTED", countContacted)
                }

                if (outgoingOffers[i].offerstatus == "REVIEWED") {
                    countReviewed = countReviewed + 1;
                    console.log("REVIEWED", countReviewed)
                }
            }

            setpendingCount(countPending);
            setacceptedCount(countAccepted);
            setdeclinedCount(countDeclined);
            setcontactedCount(countContacted);
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/offerresponse`, {
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/dismissoffer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

        } catch (err) {
            console.error(err.message)
        }
    };


    const reviewUser = async (e) => {
        try {
            const body = { reviewItem, reviewOwner, currentUserID, reviewValue, reviewText };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/reviewuser`, {
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
                                        <Link style={{ textDecoration: 'none' }} href={'/browse/' + item.id}>
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
                                            </Box>
                                        </Link>
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

                        {contactedCount >= 1 && (
                            <Badge colorScheme='blue'>Contacted {contactedCount}</Badge>
                        )}

                        {countReviewed >= 1 && (
                            <Badge colorScheme='purple'>Reviewed {countReviewed}</Badge>
                        )}
                    </AccordionButton>

                    <AccordionPanel pb={4}>
                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "PENDING" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box alignItems='center'>

                                                {item.offerstatus == "PENDING" && (
                                                    <Badge colorScheme='orange'>{item.offerstatus}</Badge>
                                                )}

                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box> */}
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge> */}
                                                {/* <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>

                                            {item.offerstatus == "PENDING" && (
                                                <Button ><Link href={'/browse/' + item.id}>View</Link></Button>
                                            )}
                                        </GridItem>
                                    )}
                                </Fragment>
                            ))
                            }
                        </Grid >

                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "ACCEPTED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box alignItems='center'>

                                                {item.offerstatus == "ACCEPTED" && (
                                                    <Badge colorScheme='green'>{item.offerstatus}</Badge>
                                                )}

                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box> */}
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge> */}
                                                {/* <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>


                                            {item.offerstatus == "ACCEPTED" && (

                                                <Stack direction='row' spacing={4}>

                                                    <Button onClick={e => {
                                                        socket.emit("add_contact", e = item.username, ({ done, newContact }) => {
                                                            if (done) {
                                                                setContactList = c => [newContact, ...c];
                                                            }
                                                            offerIDResponse(item.offerid);
                                                            offerResponse("CONTACTED");
                                                            navigate("/chat");
                                                            return;
                                                        })

                                                    }}>Contact</Button>

                                                </Stack>

                                            )}

                                        </GridItem>
                                    )}
                                </Fragment>
                            ))
                            }
                        </Grid >

                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "DECLINED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box alignItems='center'>


                                                {item.offerstatus == "DECLINED" && (
                                                    <Badge colorScheme='red'>{item.offerstatus}</Badge>
                                                )}

                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box> */}
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge> */}
                                                {/* <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>

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

                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "CONTACTED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box alignItems='center'>

                                                {item.offerstatus == "CONTACTED" && (
                                                    <Badge colorScheme='blue'>{item.offerstatus}</Badge>
                                                )}

                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box> */}
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge> */}
                                                {/* <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>


                                            {item.offerstatus == "CONTACTED" && (
                                                <HStack>
                                                    <Button onClick={e => {
                                                        offerIDResponse(item.offerid)
                                                        dismissOffer("COMPLETED");
                                                        negativeOne(counter)
                                                    }} value={offerDismissed}>Complete</Button>

                                                    <Button onClick={e => {
                                                        //offerIDResponse(item.offerid);
                                                        itemNameReview(item.itemname);
                                                        itemReviewID(item.offerid);
                                                        openModal(item.username);
                                                        //dismissOffer("REVIEWED");
                                                        negativeOne(counter)
                                                    }} value={offerDismissed}>Review</Button>
                                                </HStack>
                                            )}
                                        </GridItem>
                                    )}
                                </Fragment>
                            ))
                            }
                        </Grid >

                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "REVIEWED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            {/* <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} /> */}
                                            <Box alignItems='center'>


                                                {item.offerstatus == "REVIEWED" && (
                                                    <Badge colorScheme='purple'>{item.offerstatus}</Badge>
                                                )}



                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box> */}
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge> */}
                                                {/* <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>

                                            {item.offerstatus == "REVIEWED" && (
                                                <Button onClick={e => {
                                                    offerIDResponse(item.offerid)
                                                    dismissOffer("COMPLETED");
                                                    negativeOne(counter)
                                                }} value={offerDismissed}>Complete</Button>
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
                                            <Box>
                                                {item.offerstatus == "DISMISSED" && (
                                                    <Badge colorScheme='gray'>Declined</Badge>
                                                )}
                                            </Box>

                                            <Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
                                            </Box>

                                        </GridItem>
                                    )}
                                </Fragment>
                            ))
                            }
                        </Grid>

                        <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(6, 1fr)' gap={1} >
                            {outgoingOffers.map(item => (
                                <Fragment>
                                    {item.offerstatus === "COMPLETED" && (
                                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden' padding={"10px"}>
                                            <Box>
                                                {item.offerstatus == "COMPLETED" && (
                                                    <Badge colorScheme='blue'>Completed</Badge>
                                                )}
                                            </Box>

                                            <Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                                <Box mt='1' lineHeight='tight' isTruncated>{item.username}</Box>
                                                {/* <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box> */}
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


            <Modal isOpen={modalIsOpen}>
                <ModalOverlay />
                <ModalContent p='10px'>
                    <ModalCloseButton onClick={closeModal} />
                    <ModalHeader>Review {reviewOwner}</ModalHeader>
                    <p>How would you rate {reviewOwner}?</p>
                    <RadioGroup defaultValue={'GOOD'} onChange={setReviewValue} value={reviewValue}>
                        <HStack gap={'20px'}>
                            <Box>
                                <Radio size='lg' value='GOOD'>👍</Radio>
                            </Box>

                            <Box >
                                <Radio size='lg' value='BAD'>👎</Radio>
                            </Box>
                        </HStack>
                    </RadioGroup>

                    <p>Any additional thoughts?</p>
                    <Textarea value={reviewText}
                        onChange={handleInputChange} placeholder='Write a small review based on your experience..' m='5px'></Textarea>

                    <Button onClick={e => {
                        reviewUser();
                        offerIDResponse(reviewID)
                        dismissOffer(offerReviewed);
                        negativeOne(counter);
                        closeModal();
                    }}>Submit</Button>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default Dashboard
