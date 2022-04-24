import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AccountContext } from '../Contexts/AccountContext';
import { Badge, Box, Button, Grid, GridItem, Heading, HStack, Image, Link, Text } from '@chakra-ui/react';


const Administration = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);

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

    const banUser = async (userid) => {
        const body = { userid };
        console.log(body)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/banuser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

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
                    <GridItem pl={2} key={user.id}>
                        <Link style={{ textDecoration: 'none' }} href={'/users/' + user.username}>
                            <Heading size="sm">{user.username}</Heading>
                        </Link>
                    </GridItem>

                    <GridItem align='right'>
                        <Button colorScheme='teal' size='xs' mr={{ md: 6 }} onClick={e => {
                            banUser(user.userid)
                        }}>
                            SUSPEND USER
                        </Button>
                    </GridItem>
                </Grid>
            ))
            }


            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Manage Items</Heading>
            {items.map(item => (
                <Grid templateRows='repeat(1, 1fr)' ml={{ md: 6 }} templateColumns='repeat(2, 1fr)' maxWidth='sm' borderWidth='1px' >

                    <GridItem pl={2} key={item.id}>
                        <Link style={{ textDecoration: 'none' }} href={'/browse/' + item.id}>
                            <Box fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>{item.itemname}</Box>

                        </Link>
                    </GridItem>

                    <GridItem>
                        <Box as='span' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                    </GridItem>
                </Grid >
            ))

            }


        </div>
    )
}

export default Administration
