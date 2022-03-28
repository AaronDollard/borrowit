import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AccountContext } from '../Contexts/AccountContext';
import { Badge, Box, Button, Grid, GridItem, Heading, HStack, Image, Link, Text } from '@chakra-ui/react';


const Administration = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
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

    const getUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/getusers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            // console.log(response)
            const userData = await response.json();
            for (var i = 0; i < userData.length; i += 1) {
                console.log(userData[i]);
            }
            setUsers(userData);
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
        getUsers();
        loadPage();
    }, []);

    return (
        <div>

            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Manage Users</Heading>
            {users.map(user => (
                <Grid templateRows='repeat(1, 1fr)' ml={{ md: 6 }} templateColumns='repeat(2, 1fr)' maxWidth='sm' borderWidth='1px'>
                    <GridItem key={user.id}>
                        <Link style={{ textDecoration: 'none' }} href={'/users/' + user.username}>
                            <Heading size="sm">{user.username}</Heading>
                        </Link>
                    </GridItem>

                    <GridItem>
                        <Text style={{ textDecoration: 'none' }} mr={{ md: 6 }} align='right'>
                            Ban
                        </Text>
                    </GridItem>
                </Grid>
            ))
            }


            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Manage Items</Heading>
            <Grid templateRows='repeat(1, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} >
                {items.map(item => (
                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' align="cenleftter">
                        <Link style={{ textDecoration: 'none' }} href={'/browse/' + item.id}>

                            <Box padding={"10px"}>
                                <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>
                                <Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                            </Box>
                        </Link>
                    </GridItem>

                ))
                }
            </Grid >

        </div>
    )
}

export default Administration
