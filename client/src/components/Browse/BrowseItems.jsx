import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link, Input } from '@chakra-ui/react';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { StarIcon } from '@chakra-ui/icons'
import { AccountContext } from '../Contexts/AccountContext';
import '../../styles/styles.css'

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

    const [search, setNewSearch] = useState("");
    const handleSearchChange = (e) => {
        setNewSearch(e.target.value);
    };
    const filtered = !search
        ? items
        : items.filter((itemm) =>
            itemm.itemname.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' display={{ md: 'flex' }}>
                {latestItems.map(item => (
                    <GridItem key={item.id} mt={{ base: 5, md: 0 }} ml={{ md: 6 }} maxW='300px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <Link style={{ textDecoration: 'none' }} href={'/browse/' + item.id}>
                            <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />

                            <Box padding={"10px"}>
                                <Box display='flex' mt='2' alignItems='center'>
                                    <Badge colorScheme='teal'>{item.giveaway}</Badge>
                                    <Box ml='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                </Box>

                                <Box lineHeight='tight' isTruncated>{item.descr}</Box>
                                < Box color='gray.600'><Link href={'/users/' + item.username}>{item.username}</Link></Box>

                                <Box display='flex' >
                                    <Box as='span' color='gray.600' fontSize='sm'>{item.condition}</Box>
                                </Box>
                            </Box>
                        </Link>
                    </GridItem>
                ))
                }
            </Grid >

            <Heading ml={"10px"} fontFamily={"Dongle"}>Browse all items</Heading>
            <Input m={"10px"} alignContent={'center'} maxW={'2xl'} type="search" value={search} onChange={handleSearchChange} className="input" label="Search" color={"gray"} placeholder='Search for an item'></Input>

            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' >
                {filtered.map((itemm) => (
                    <Fragment>
                        <GridItem key={itemm.id} mt={{ base: 5, md: 0 }} ml={{ md: 6 }} maxW='300px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Link style={{ textDecoration: 'none' }} href={'/browse/' + itemm.id}>
                                <Image boxSize='sm' objectFit='cover' src={itemm.photo} alt={itemm.imagealt} />

                                <Box padding={"10px"}>
                                    <Box display='flex' mt='2' alignItems='center'>
                                        <Badge colorScheme='teal'>{itemm.giveaway}</Badge>
                                        <Box ml='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{itemm.itemname}</Box>
                                    </Box>

                                    <Box lineHeight='tight' isTruncated>{itemm.descr}</Box>
                                    < Box color='gray.600'><Link href={'/users/' + itemm.username}>{itemm.username}</Link></Box>

                                    {/* <Box as='span' color='gray.600' fontSize='sm'>{itemm.lendlength}</Box> */}
                                    <Box display='flex' >
                                        <Box as='span' color='gray.600' fontSize='sm'>{itemm.condition}</Box>
                                    </Box>
                                </Box>
                            </Link>
                        </GridItem>
                    </Fragment>
                ))}
            </Grid>
        </>
    )
}

export default BrowseItems;