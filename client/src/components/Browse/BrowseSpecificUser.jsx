import { Badge, Text, Box, Button, Grid, GridItem, Heading, Image, Link, VStack, HStack, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import React, { Fragment, useEffect } from 'react'
import { useState, useContext } from 'react';
import { StarIcon, EmailIcon, AtSignIcon, PhoneIcon } from '@chakra-ui/icons'
import { AccountContext } from '../Contexts/AccountContext';

const BrowseSpecificUser = () => {
    const [users, setUsers] = useState([]);
    const [usersItems, setClickedUserItems] = useState([]);
    const [reviews, setClickedUserReviews] = useState([]);

    const { user } = useContext(AccountContext);

    const [fname, setFName] = useState(user.firstname);
    const [sname, setSName] = useState(user.surname);
    const [email, setEmail] = useState(user.email);
    const [home, setHome] = useState(user.home);
    const [socials, setSocials] = useState(user.socials);
    const [phone, setPhone] = useState(user.phone);
    const [profilepic, setPP] = useState(user.profilepic);

    const currentUserID = user.userid;

    var userID = window.location.pathname;
    //console.log(userID.split('/')[2]); //Split the url to get the item ID
    userID = userID.split('/')[2];

    const getSpecificUser = async () => {
        const body = { userID };
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/users/:id`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            //console.log(response)
            const userRes = await response.json();
            console.log(userRes)
            setUsers(userRes);
        } catch (err) {
            console.error(err.message)
        }
    };

    const getClickedUserItems = async () => {
        try {
            const body = { userID };
            console.log(userID)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/usersitems/:id`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            //console.log(response)

            const userItemData = await response.json();
            setClickedUserItems(userItemData);
            for (var i = 0; i < userItemData.length; i += 1) {
                //console.log(userItemData[i]);
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    const getReviews = async () => {
        //console.log('userid', userID)
        try {
            const body = { userID };
            //console.log(userID)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/getuserreview/:id`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            //console.log(response)

            const userReviewData = await response.json();
            setClickedUserReviews(userReviewData);
            for (var i = 0; i < userReviewData.length; i += 1) {
                //console.log(userReviewData[i]);
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    const onSubmitUpdateProfile = async () => {
        console.log("Item has been listed")
        try {
            console.log(currentUserID, "Profile Page - Update Debug");

            const body = { currentUserID, fname, sname, email, home, socials, phone, profilepic };
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/updateprofile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            closeModal()
            window.location.reload(true);
        } catch (err) {
            console.log(err.message)
        }
    }

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        getSpecificUser();
        getClickedUserItems();
        getReviews();
    }, []);

    return (
        <div>
            {users.map(user => (
                <Fragment>
                    <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
                        <GridItem padding={"10px"}>
                            <Image borderRadius='full' src={user.profilepic} alt={user.username} />
                        </GridItem>

                        <GridItem>
                            <Heading>{user.username}'s Profile</Heading>
                            <VStack align={'left'}>
                                {user.firstname !== "" && user.surname !== "" && (
                                    <Text fontSize='xl'>👤 - {user.firstname} {user.surname}</Text>
                                )}
                                {user.firstname === "" || user.surname === "" && (
                                    <Text fontSize='xl'>👤 - {user.firstname} {user.surname}</Text>
                                )}

                                {user.email !== "" && user.email !== null && (
                                    <Text fontSize='xl'>📧 - {user.email}</Text>
                                )}
                                {user.email === "" && (
                                    <Text fontSize='xl'>📧 - No email given..</Text>
                                )}

                                {user.socials !== "" && user.socials !== null && (
                                    <Text fontSize='xl'>＠ - {user.socials}</Text>
                                )}
                                {user.socials === "" || user.socials === null && (
                                    <Text fontSize='xl'>＠ - No socials given..</Text>
                                )}

                                {user.phone !== "" && user.phone !== null && (
                                    <Text fontSize='xl'>📞 - +353 {user.phone}</Text>
                                )}
                                {user.phone === "" && (
                                    <Text fontSize='xl'>📞 - No phone number given..</Text>
                                )}

                                {user.home !== "" && user.home !== null && (
                                    <Text fontSize='xl'>🌎 - {user.home}</Text>
                                )}
                                {user.home === "" && (
                                    <Text fontSize='xl'>🌎 - No hometown given..</Text>
                                )}

                            </VStack>

                            {currentUserID === user.userid && (
                                <Button margin={'10px'} size='sm' onClick={openModal}>Edit Profile</Button>
                            )}
                        </GridItem >
                    </Grid>


                    <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>{user.username}'s Catalog</Heading>
                    <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                        {usersItems.map(item => (
                            <Fragment>
                                <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                    <Link style={{ textDecoration: 'none' }} href={'/browse/' + item.itemid}>
                                        <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
                                        <Box padding={"10px"}>
                                            <Box display='flex' mt='2' alignItems='center'>
                                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                                <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                            </Box>

                                            <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                            <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                            <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>

                                            {userID !== item.itemowner && (
                                                <>
                                                    <Box display='flex' mt='2'>
                                                        {Array(5)
                                                            .fill('') //NEED TO IMPLEMENT USER.RATING TO THIS PART OF THE CODE
                                                            .map((_, i) => (
                                                                <StarIcon
                                                                    key={i}
                                                                    color={i < item.rating ? 'teal.500' : 'gray.300'}
                                                                />
                                                            ))}
                                                        < Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Link>
                                </GridItem>
                            </Fragment>
                        ))
                        }

                    </Grid>

                    <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>{user.username}'s Reviews</Heading>
                    <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(1, 1fr)' gap={1} >
                        {reviews.map(review => (
                            <Fragment>
                                <GridItem key={review.id} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                                    <HStack>
                                        <Text fontSize='xl'><Link href={'/users/' + review.username}>{review.username}</Link></Text>
                                        <Text fontSize='xl'>{review.itemborrowed}</Text>
                                        <Text fontSize='xl'>
                                            {review.outcome == "GOOD" && (
                                                <Text>👍</Text>
                                            )}
                                            {review.outcome == "BAD" && (
                                                <Text>👎</Text>
                                            )}
                                        </Text>
                                    </HStack>
                                    <Text fontSize='lg'>{review.review}</Text>
                                </GridItem>
                            </Fragment>
                        ))
                        }
                    </Grid>
                </Fragment>
            ))
            }

            <Modal isOpen={modalIsOpen}>
                <ModalOverlay />
                <ModalContent p='10px'>
                    <ModalCloseButton onClick={closeModal} />
                    <ModalHeader>Edit Profile</ModalHeader>

                    <form>
                        <label for="fname">First Name</label>
                        <Input value={fname} placeholder={fname} size='sm' onChange={e => setFName(e.target.value)} />

                        <label for="sname">Surname</label>
                        <Input value={sname} placeholder={sname} size='sm' onChange={e => setSName(e.target.value)} />

                        <label for="email">Email</label>
                        <Input type={email} value={email} placeholder={user.email} size='sm' onChange={e => setEmail(e.target.value)} />

                        <label for="home">Hometown</label>
                        <Input value={home} placeholder={home} size='sm' onChange={e => setHome(e.target.value)} />

                        <label for="social">Socials</label>
                        <Input value={socials} placeholder={socials} size='sm' onChange={e => setSocials(e.target.value)} />

                        <label for="phone">Phone Number</label>
                        <InputGroup>
                            <InputLeftAddon children='+353' />
                            <Input value={phone} type='tel' placeholder='Phone number' onChange={e => setPhone(e.target.value)} />
                        </InputGroup>

                        <label for="profilepic">Profile Photo <i>(Optional)</i></label>
                        <Input value={profilepic} placeholder='Link to your profile photo' onChange={e => setPP(e.target.value)} />
                        <Text fontSize={'sm'}>Please allow time for us to process your changes.
                            Your changes will take effect on your next login..</Text>

                        <Button onClick={onSubmitUpdateProfile} variant={'solid'} colorScheme={'teal'} size={'sm'} mr={4}>Update Profile</Button>
                        {/* <button class="btn btn-primary">Update Profile</button> */}
                    </form>

                </ModalContent>
            </Modal>

        </div >

    )
}

export default BrowseSpecificUser;