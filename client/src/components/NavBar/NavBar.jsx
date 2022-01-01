import { ReactNode } from 'react';
import { Box, Flex, Avatar, HStack, VStack, Heading, Text, Link, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, useColorModeValue, Stack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [period, setPeriod] = useState("");
  const [photo, setPhoto] = useState("Link to photo");
  const [giveaway, setGiveaway] = useState(false);

  const { user, setUser } = useContext(AccountContext);
  const currentUserID = user.userid;
  console.log("Current Logged User ID", currentUserID, "NavBar Debug")
  const currentUser = user.username;


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
    console.log("Item has been listed")
    try {
      console.log(currentUserID, "NavBar Debug");

      const body = { name, description, condition, period, photo, giveaway, currentUserID };
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
                  size={'md'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Hello, {currentUser}!</MenuItem>
                <MenuItem>My Profile</MenuItem>
                <MenuItem>My Account</MenuItem>
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

      <Modal style={{
        overlay: {
          width: '100%',
          height: "100%",
        },
        content: {
          position: 'absolute',
          top: '25%',
          left: '20%',
          right: '20%',
          bottom: '25%',
          border: '1px solid #ccc',
        }

      }} isOpen={modalIsOpen} onRequestClose={closeModal}>
        <VStack spacing="1rem">
          <Heading>Create a listing</Heading>

          <form onSubmit={onSubmitCreateListing}>
            <label for="name">Item Name</label>
            <input
              required
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)} />

            <label for="description">Item Description</label>
            <input
              required
              type="text"
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)} />

            <label for="condition">Item Condition</label>
            <select required className="form-control" onChange={e => setCondition(e.target.value)}>
              <option value="" selected disabled hidden>-- Select Condition --</option>
              <option value="Used">Used</option>
              <option value="Good Condition">Good</option>
              <option value="New">New</option>
            </select>

            <label for="period">Lending Period</label>
            <select required className="form-control" onChange={e => setPeriod(e.target.value)}>
              <option value="" selected disabled hidden>-- Select Lending Length --</option>
              <option value="Couple Days (1 - 2)">1 to 2 days</option>
              <option value="Few Days (3 - 4)">3 to 4 days</option>
              <option value="One Week">1 week</option>
            </select>

            <HStack>
              <label for="photo">Photo</label>
              <input
                placeholder="Link to photo"
                type="text"
                className="form-control"
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