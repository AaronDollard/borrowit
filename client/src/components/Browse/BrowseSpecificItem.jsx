import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link, VStack, Flex, Avatar, HStack, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'
import { AccountContext } from "../Contexts/AccountContext"
import { useNavigate } from "react-router";


const BrowseSpecificItem = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [offerstatus, setPeriod] = useState("PENDING");
    const [loaded, setLoaded] = useState("NOTLOADED");
    const [status, setStatus] = useState("");
    const { user, setUser } = useContext(AccountContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("");
    const [period, setPeriodLength] = useState("");
    const [photo, setPhoto] = useState("Link to photo");
    const [giveaway, setGiveaway] = useState(false);

    const currentUserID = user.userid;
    console.log("Current Logged User ID", currentUserID, "NavBar Debug")
    const currentUser = user.username;

    const borrowerid = user.userid;
    var lenderid;
    var id;

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalOfferIsOpen, setIsMakeOfferOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    function openMakeOfferModal() {
        setIsMakeOfferOpen(true);
    }

    const getSpecificItem = async () => {
        var itemID = window.location.pathname;
        console.log(itemID.split('/')[2]); //Split the url to get the item ID
        itemID = itemID.split('/')[2];
        const body = { itemID };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/items/:id`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // console.log(response)
            const itemData = await response.json();
            for (var i = 0; i < itemData.length; i += 1) {
                console.log(itemData[i]);
            }
            setItems(itemData);
            console.log(loaded)
            console.log(status)
            setLoaded("LOADED");
        } catch (err) {
            console.error(err.message)
        }
    };

    const makeOffer = async () => {
        console.log("Offer has been made")
        lenderid = items[0].itemowner; //Get the itemowner id
        id = items[0].id; //Get the itemo id
        console.log(lenderid)
        console.log(borrowerid)
        console.log(id)
        try {
            const body = { id, lenderid, offerstatus, borrowerid };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/offers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            openMakeOfferModal();
            console.log(body, "logging on BrowseSpecificItem")
        } catch (err) {
            console.log(err.message)
        }
    }

    const deleteOffer = async () => {
        openModal();
        console.log("Offer has been deleted")
        id = items[0].id;
        lenderid = items[0].itemowner;
        console.log(lenderid)
        console.log(id)
        try {
            const body = { id, lenderid };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/deleteoffer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const findOfferStatus = async () => {
        try {
            lenderid = items[0].itemowner; //Get the itemowner id
            id = items[0].id; //Get the itemo id

            const body = { id, lenderid, borrowerid };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/findOfferStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const offerCurrentStatus = await response.json();

            setStatus(offerCurrentStatus.offerstatus);
            console.log(offerCurrentStatus.offerstatus, "Offer Status Response")

        } catch (err) {
            console.error(err.message)
        }
    };

    const onSubmitUpdateListing = async (e) => {
        var itemID = window.location.pathname;
        console.log(itemID.split('/')[2]); //Split the url to get the item ID
        itemID = itemID.split('/')[2];

        console.log("Item has been updated")
        try {
            console.log(currentUserID, "Browse Specific Debug");
            const body = { name, description, condition, period, photo, giveaway, itemID };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/updateitems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(body, "Update logging")
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        findOfferStatus();
        getSpecificItem();
    }, [status, loaded]);

    return (
        <>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(2, 1fr)' gap={1} >
                {items.map(item => (
                    <Fragment>
                        <Box padding={"10px"}>
                            <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
                            </GridItem>
                        </Box>

                        <GridItem>
                            <Box mt='2'>
                                <Heading mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Heading>
                            </Box>
                            <Badge borderRadius='full' px='2' colorScheme='teal'>To {item.giveaway}</Badge>
                            <Box mt='1' as='h4' lineHeight='tight'><b>Condition:</b> {item.condition}</Box>
                            <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>

                            <Box as='span' color='gray.600' fontSize='sm'>Borrow length: {item.lendlength}</Box>

                            <Box display='flex' mt='2'>
                                {Array(5)
                                    .fill('') //NEED TO IMPLEMENT USER.RATING TO THIS PART OF THE CODE
                                    .map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            color={i < item.rating ? 'teal.500' : 'gray.300'}
                                        />
                                    ))}
                                <Box as='span' ml='2' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                            </Box>

                            {/* Checks to see if the logged in user is not the person who owns the item. This is to prevent borrowing ones own items */}
                            {user.userid !== item.itemowner && status !== "PENDING" && status !== "DECLINED" && status !== "ACCEPTED" && (
                                <Button onClick={makeOffer} >Make Offer</Button>
                            )}

                            {status === "PENDING" && (
                                <Text>You have already sent a request for this item..</Text>
                            )}

                            {status === "DECLINED" && (
                                <Text>Your request has been declined. Check your dashboard to clear the offer...</Text>
                            )}

                            {status === "ACCEPTED" && (
                                <Text>Your request as been accepted. Go to your dashboard to get in contact with the lender.</Text>
                            )}

                        </GridItem>

                        {/* Checks to make sure the user owns the item */}
                        {user.userid === item.itemowner && (
                            <GridItem maxW='sm' overflow='hidden'>
                                <VStack spacing="1rem">
                                    <Heading>Update your listing</Heading>

                                    <form onSubmit={onSubmitUpdateListing}>
                                        <label for="name">Item Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            placeholder={item.itemname}
                                            value={name}
                                            onChange={e => setName(e.target.value)} />

                                        <label for="description">Item Description</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            placeholder={item.descr}
                                            value={description}
                                            onChange={e => setDescription(e.target.value)} />

                                        <label for="condition">Item Condition</label>
                                        <select required className="form-control" onChange={e => setCondition(e.target.value)}>
                                            <option value={condition} selected disabled hidden>-- Select Condition --</option>
                                            <option value="Used">Used</option>
                                            <option value="Good Condition">Good</option>
                                            <option value="New">New</option>
                                        </select>

                                        <label for="period">Lending Period</label>
                                        <select required className="form-control" onChange={e => setPeriodLength(e.target.value)}>
                                            <option value={period} selected disabled hidden>-- Select Lending Length --</option>
                                            <option value="Couple Days (1 - 2)">1 to 2 days</option>
                                            <option value="Few Days (3 - 4)">3 to 4 days</option>
                                            <option value="One Week">1 week</option>
                                        </select>

                                        <label for="photo">Photo</label>
                                        <HStack>
                                            <input
                                                placeholder={item.photo}
                                                type="text"
                                                className="form-control"
                                                onChange={e => setPhoto(e.target.value)} />
                                        </HStack>

                                        <HStack>
                                            <label for="giveaway">Give away item for good?</label>
                                            <input
                                                type="checkbox"
                                                value={giveaway}
                                                onChange={e => !setGiveaway(true)} />
                                        </HStack>

                                        <button class="btn btn-primary">Update Listing</button>
                                    </form>

                                    <Box textAlign="center">
                                        <Heading>Delete your listing</Heading>
                                        <Text fontSize='sm' fontWeight={"thin"}>If you wish to delete your listing permenantly click the button below.
                                            Be aware that this CANNOT be undone.</Text>
                                        <Button colorScheme='red' onClick={deleteOffer}>Delete</Button>
                                    </Box>
                                </VStack>
                            </GridItem>
                        )}
                    </Fragment>
                ))
                }
            </Grid >

            <Modal isOpen={modalIsOpen}>
                <ModalOverlay />
                <ModalContent p='10px'>
                    <ModalCloseButton onClick={closeModal} />
                    <ModalHeader>Gone forever!</ModalHeader>
                    <p>Your offer has been permanently deleted!</p>
                    <Link href='/dashboard'><Button>Ok</Button></Link>
                </ModalContent>
            </Modal>

            <Modal isOpen={modalOfferIsOpen} >
                <ModalOverlay />
                <ModalContent p='10px'>
                    <ModalHeader>Your offer has been sent!</ModalHeader>
                    <p>You should recieve an answer soon...</p>
                    <Link href='/browse'><Button>Ok</Button></Link>
                </ModalContent>
            </Modal>
        </>
    )
}

export default BrowseSpecificItem;