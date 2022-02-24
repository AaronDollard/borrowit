import { Heading } from '@chakra-ui/react';
import React from 'react';
import BrowseItems from '../Browse/BrowseItems';

const Browse = () => {

    return (
        <div>
            <Heading paddingLeft={"10px"} fontFamily={"Dongle"}>Four Newest items</Heading>
            <BrowseItems />
        </div>
    )
}

export default Browse
