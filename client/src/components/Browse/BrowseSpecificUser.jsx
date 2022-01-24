import { Badge, Box, Button, Grid, GridItem, Heading, Image, VStack } from '@chakra-ui/react';
import React, { Fragment, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'

const BrowseSpecificUser = () => {
    const [users, setUsers] = useState([]);

    const getSpecificUser = async () => {
        var userID = window.location.pathname;
        console.log(userID.split('/')[2]); //Split the url to get the item ID
        userID = userID.split('/')[2];
        const body = { userID };

        try {
            const response = await fetch("http://localhost:4000/auth/users/:id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(response)
            const userID = await response.json();
            setUsers(userID);
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        getSpecificUser();
    }, []);

    return (
        <div>
            {users.map(user => (
                <Fragment>
                    <Heading>{user.username}'s Profile</Heading>
                </Fragment>
            ))
            }
        </div>
    )
}

export default BrowseSpecificUser;