import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link } from '@chakra-ui/react';
import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'
import { AccountContext } from '../Contexts/AccountContext';

const BrowseItems = () => {
    const [items, setItems] = useState([]);
    const [latestItems, setLatestItems] = useState([]);
    const [pageLoaded, setPageLoaded] = useState("false");

    const { user } = useContext(AccountContext);
    console.log(user.username)
    const currentUserID = user.userid;

    const getItems = async () => {
        const body = { currentUserID };
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/itemsbrowse`, {
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
        } catch (err) {
            console.error(err.message)
        }
    };

    const getLatestItem = async () => {
        const body = { currentUserID };
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/itemsbrowselatest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            // console.log(response)
            const itemData = await response.json();
            for (var i = 0; i < itemData.length; i += 1) {
                console.log(itemData[i]);
            }
            setLatestItems(itemData);
        } catch (err) {
            console.error(err.message)
        }
    };


    const loadPage = async () => {
        if (user.userid === undefined) {
            window.location.reload(true);
        }
        else return;
    };

    useEffect(() => {
        getItems();
        getLatestItem();

        loadPage();
    }, []);

    return (
        <>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                {latestItems.map(item => (
                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' align="cenleftter">
                        <Link href={'/browse/' + item.id}>
                            <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />

                            <Box padding={"10px"}>
                                <Box display='flex' mt='2' alignItems='center'>
                                    <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                    <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{item.condition}</Box>
                                </Box>

                                <Box mt='1' lineHeight='tight' isTruncated>{item.descr}</Box>
                                <Badge borderRadius='full' px='2' colorScheme='teal'>{item.giveaway}</Badge>
                                <Box as='span' color='gray.600' fontSize='sm'>{item.lendlength}</Box>
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
                            </Box>
                        </Link>
                    </GridItem>

                ))
                }
            </Grid >

            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Browse all items</Heading>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                {items.map(itemm => (
                    <Fragment>
                        <GridItem key={itemm.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' align="cenleftter" mb='10px'>
                            <Link href={'/browse/' + itemm.id}>
                                <Image boxSize='sm' objectFit='cover' src={itemm.photo} alt={itemm.imagealt} />

                                <Box padding={"10px"}>
                                    <Box display='flex' mt='2' alignItems='center'>
                                        <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{itemm.itemname}</Box>
                                        <Box as='span' ml='2' color='gray.600' lineHeight='tight' fontSize='sm'>{itemm.condition}</Box>
                                    </Box>

                                    <Box mt='1' lineHeight='tight' isTruncated>{itemm.descr}</Box>
                                    <Badge borderRadius='full' px='2' colorScheme='teal'>{itemm.giveaway}</Badge>
                                    <Box as='span' color='gray.600' fontSize='sm'>{itemm.lendlength}</Box>
                                    <Box display='flex' mt='2'>
                                        {Array(5)
                                            .fill('') //NEED TO IMPLEMENT USER.RATING TO THIS PART OF THE CODE
                                            .map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    color={i < itemm.rating ? 'teal.500' : 'gray.300'}
                                                />
                                            ))}
                                        < Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + itemm.username}>{itemm.username}</Link></Box>
                                    </Box>

                                </Box>
                            </Link>
                        </GridItem>
                    </Fragment>
                ))
                }
            </Grid>
        </>
    )
}

export default BrowseItems;