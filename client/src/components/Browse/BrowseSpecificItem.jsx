import { Badge, Box, Button, Grid, GridItem, Heading, Image, Link, VStack } from '@chakra-ui/react';
import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'
import { AccountContext } from "../Contexts/AccountContext"


const BrowseSpecificItem = () => {
    const [items, setItems] = useState([]);
    const [offerstatus, setPeriod] = useState("PENDING");
    const { user, setUser } = useContext(AccountContext);
    const borrowerid = user.userid;
    var lenderid;
    var id;

    const getSpecificItem = async () => {
        var itemID = window.location.pathname;
        console.log(itemID.split('/')[2]); //Split the url to get the item ID
        itemID = itemID.split('/')[2];
        const body = { itemID };

        try {
            const response = await fetch("http://localhost:4000/auth/items/:id", {
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

    const makeOffer = async () => {
        console.log("Offer has been made")
        lenderid = items[0].itemowner; //Get the itemowner id
        id = items[0].id; //Get the itemo id
        console.log(lenderid)
        console.log(borrowerid)
        console.log(id)
        try {
            const body = { id, lenderid, offerstatus, borrowerid };
            const response = await fetch("http://localhost:4000/auth/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            console.log(body, "logging on BrowseSpecificItem")
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getSpecificItem();
    }, []);

    return (
        <>
            <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
                {items.map(item => (
                    <Fragment>
                        <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                            <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
                        </GridItem>

                        <GridItem>
                            <Box display='flex' mt='2' alignItems='center'>
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
                                        <StarIcon color={'teal.500'}
                                            key={i}
                                            color={i < item.rating ? 'teal.500' : 'gray.300'}
                                        />
                                    ))}
                                <Box as='span' ml='2' color='gray.600' fontSize='sm'><Link href={'/users/' + item.username}>{item.username}</Link></Box>
                            </Box>

                            {user.userid !== item.itemowner && (
                                <Button onClick={makeOffer} >Make Offer</Button>
                            )}
                        </GridItem>
                    </Fragment>
                ))
                }
            </Grid >
        </>
    )
}

export default BrowseSpecificItem;