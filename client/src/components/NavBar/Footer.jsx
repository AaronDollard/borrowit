import { Box, Container, Stack, Text, useColorModeValue, Link } from '@chakra-ui/react';
import { SocialIcon } from 'react-social-icons';

export const Footer = () => {
    return (
        <Box
            position='fixed'
            bottom='0'
            width='100%'

            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>

            <Box
                borderTopWidth={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}
                    direction={{ base: 'column', md: 'row' }}
                    spacing={4}
                    justify={{ base: 'center', md: 'space-between' }}
                    align={{ base: 'center', md: 'center' }}>
                    <Text>© 2020 Borrowit. All rights reserved</Text>
                    <Stack direction={'row'} spacing={6}>
                        <SocialIcon url="https://www.linkedin.com/in/aarondollard/" style={{ height: 30, width: 30 }} />
                        <SocialIcon url="https://github.com/AaronDollard" style={{ height: 30, width: 30 }} />
                    </Stack>
                </Container>
            </Box>
        </Box>
    );

}
export default Footer;