import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link, VStack } from '@chakra-ui/react';
import React, { Fragment, useEffect } from 'react'
import { useState, useContext } from 'react';
import { StarIcon } from '@chakra-ui/icons'

const BrowseSpecificUser = () => {
    const [users, setUsers] = useState([]);
    const [usersItems, setClickedUserItems] = useState([]);

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
            // console.log(response)
            const userID = await response.json();
            setUsers(userID);
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
            console.log(response)

            const userItemData = await response.json();
            setClickedUserItems(userItemData);
            for (var i = 0; i < userItemData.length; i += 1) {
                console.log(userItemData[i]); //Print all of the items to the console for debugging
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        getSpecificUser();
        getClickedUserItems();
    }, []);

    return (
        <div>
            {users.map(user => (
                <Fragment>
                    {user.username === userID && (

                        < Heading ></Heading>
                    )}
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
                </Fragment>
            ))
            }
        </div >
    )
}

export default BrowseSpecificUser;