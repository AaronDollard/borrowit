import { Badge, Box, Button, Grid, GridItem, Image, VStack } from '@chakra-ui/react';
import React, { Fragment, useEffect } from 'react'
import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons'

const BrowseItems = () => {
    const [items, setItems] = useState([]);

    const getItems = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth/items")
            const itemData = await response.json();
            setItems(itemData);
            for (var i = 0; i < itemData.length; i += 1) {
                console.log(itemData[i]); //Print all of the items to the console for debugging
            }
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(3, 1fr)' gap={1} >
            {items.map(item => (
                <Fragment>
                    <GridItem key={item.id} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} maxW='sm' borderWidth='2px' borderRadius='lg' overflow='hidden'>
                        <Image boxSize='sm' objectFit='cover' src={item.photo} alt={item.imagealt} />
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
                            < Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                {item.username}
                            </Box>
                        </Box>

                    </GridItem>
                </Fragment>
            ))
            }
        </Grid >
    )

}

export default BrowseItems;