import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link, VStack } from '@chakra-ui/react';
import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'
import { AccountContext } from '../Contexts/AccountContext';

const BrowseItems = () => {
    const [items, setItems] = useState([]);
    const [latestItems, setLatestItems] = useState([]);

    const { user, setUser } = useContext(AccountContext);
    const currentUserID = user.userid;

    const getItems = async () => {
        const body = { currentUserID };
        try {
            const response = await fetch("http://localhost:4000/auth/itemsbrowse", {
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
            const response = await fetch("http://localhost:4000/auth/itemsbrowselatest", {
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

    useEffect(() => {
        getItems();
        getLatestItem();
    }, []);

    return (
        <>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                {latestItems.map(item => (
                    <Fragment>
                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' align="cenleftter">
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
                                            <StarIcon color={'teal.500'}
                                                key={i}
                                                color={i < item.rating ? 'teal.500' : 'gray.300'}
                                            />
                                        ))}
                                    < Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                                </Box>
                                <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                            </Box>
                        </GridItem>
                    </Fragment>
                ))
                }
            </Grid >

            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Browse all items</Heading>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                {
                    items.map(item => (
                        <Fragment>
                            <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' align="cenleftter">
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
                                                <StarIcon color={'teal.500'}
                                                    key={i}
                                                    color={i < item.rating ? 'teal.500' : 'gray.300'}
                                                />
                                            ))}
                                        < Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                                    </Box>
                                    <Button><Link href={'/browse/' + item.id}>View</Link></Button>
                                </Box>
                            </GridItem>
                        </Fragment>
                    ))
                }
            </Grid>


        </>
    )
}

export default BrowseItems;