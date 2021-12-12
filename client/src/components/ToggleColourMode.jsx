import React from 'react'
import { Button } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

// Below is used to control dark and light modes between the application
const ToggleColourMode = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <div>
            <Button onClick={() => toggleColorMode()}
                pos="absolute" top="0" right="0" m="1rem">
                {colorMode === "dark" ? <SunIcon color="orange.400" /> : <MoonIcon />}
            </Button>
        </div>
    )
}

export default ToggleColourMode