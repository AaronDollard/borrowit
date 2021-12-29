import { ReactNode } from 'react';
import { Box, Flex, Avatar, HStack, VStack, Heading, Text, Link, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, useColorModeValue, Stack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input'
import ToggleColourMode from "../ToggleColourMode"

import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AccountContext } from "../Contexts/AccountContext"
import { useState } from 'react';

import Modal from 'react-modal';
import { Form } from "formik";
import useSocket from '../Hooks/useSocket';
import socket from '../../Socket/socket';

const Home = () => {
  useSocket();
  //Add a listening
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [period, setPeriod] = useState("");
  const [photo, setPhoto] = useState("");
  const [giveaway, setGiveaway] = useState(false);

  const { user, setUser } = useContext(AccountContext);
  const currentUser = user.userid;
  console.log(currentUser)

  const navigate = useNavigate
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Add item modal
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const onSubmitCreateListing = async (e) => {
    e.preventDefault();
    try {
      console.log(currentUser, "NavBar Debug");

      const body = { name, description, condition, period, photo, giveaway, currentUser };
      const response = await fetch("http://localhost:4000/auth/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      console.log(body, "logging on navbar")
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Borrowit</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <Link href='/dashboard'>Dashboard</Link>
              <Link href='/browse'>Browse</Link>
              <p>{currentUser}</p>
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>

            <Button
              onClick={openModal} //Add the item modal
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              leftIcon={<AddIcon />}>
              Make Offer
            </Button>

            <Menu>
              <ToggleColourMode />
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>TEMPLATE 1</MenuItem>
                <MenuItem>TEMPLATE 2</MenuItem>
                <MenuDivider />

                <MenuItem onClick={() => {
                  if (!user.loggedIn) return;
                  setUser({ loggedIn: false });
                }}>Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link href='/dashboard'>Dashboard</Link>
              <Link href='/browse'>Browse</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <VStack spacing="1rem">
          <Heading>Create a listing</Heading>

          <form onSubmit={onSubmitCreateListing}>
            <label for="name">Item Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)} />

            <label for="description">Item Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)} />

            <label for="condition">Item Condition</label>
            <select defaultValue="Used" className="form-control" value={condition} onChange={e => setCondition(e.target.value)}>
              <option value="Used">Used</option>
              <option value="Good">Good</option>
              <option value="New">New</option>
            </select>

            <label for="period">Lending Period</label>
            <select defaultValue="34" className="form-control" value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="coupledays">1 to 2 days</option>
              <option value="fewdays">3 to 4 days</option>
              <option value="oneweek">1 week</option>
            </select>

            <HStack>
              <label for="photo">Photo</label>
              <input
                type="file"
                value={photo}
                onChange={e => setPhoto(e.target.value)} />
            </HStack>

            <HStack>
              <label for="giveaway">Give away item for good?</label>
              <input
                type="checkbox"
                value={giveaway}
                onChange={e => !setGiveaway(true)} />
            </HStack>

            <button>Create Listing</button>
          </form>
        </VStack>
      </Modal>
    </>
  );
}

export default Home;