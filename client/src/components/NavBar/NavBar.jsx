import { ReactNode } from 'react';
import { Box, Flex, Avatar, HStack, VStack, Heading, Text, Link, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useColorModeValue, Stack, Img } from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/hooks";
import { HamburgerIcon, CloseIcon, AddIcon, MinusIcon, ChatIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input'
import ToggleColourMode from "../ToggleColourMode"
import { useNavigate } from "react-router";
import { useContext } from 'react'
import { AccountContext } from "../Contexts/AccountContext"
import { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [period, setPeriod] = useState("");
  const [photo, setPhoto] = useState("Link to photo");
  const [giveaway, setGiveaway] = useState(false);

  const { user, setUser } = useContext(AccountContext);
  const currentUserID = user.userid;
  console.log("Current token ID", user, "NavBar Debug")
  console.log("Current Logged User ID", user.username, "NavBar Debug")
  const currentUser = user.username;
  const baseURL = process.env.REACT_APP_SERVER_URL;

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
      const response = await fetch(baseURL + "/auth/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      console.log(response);
      console.log(body, "logging on navbar")
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
          width='100%'>

          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          {/* <HStack>
            <Img boxSize='60px' src=""></Img>
            <Text fontStyle={"italic"} fontWeight={"bold"} textAlign={"center"}>Borrowit<br />Lendit</Text>
          </HStack> */}

          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            <Link href='/dashboard'>Dashboard</Link>
            <Link href='/browse'>Browse</Link>
            <Input
              label="Search"
              color={"gray"}
              background={"white"}
              placeholder='Search for an item'></Input>
          </HStack>

          <Flex alignItems={'center'}>
            <Button
              onClick={openModal} //Add the item modal
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              leftIcon={<AddIcon />}>
              New Listing
            </Button>

            <Menu>
              <HStack>
                <Link href='/chat'><Button><ChatIcon /></Button></Link>
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
                      'https://bit.ly/3G8EroR'
                    } />
                </MenuButton>
              </HStack>

              <MenuList>
                <MenuItem>Hello, {currentUser}!</MenuItem>
                <MenuItem><Link href={'/users/' + user.username}>My Profile</Link></MenuItem>
                {/* <MenuItem>My Account</MenuItem> */}
                <MenuDivider />

                <MenuItem onClick={() => {
                  if (!user.loggedIn) return;
                  localStorage.removeItem("token");
                  setUser({ loggedIn: false });
                  navigate("/");
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
              <Link href='/chat'>Contacts</Link>
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Modal isOpen={modalIsOpen}>
        <ModalOverlay />
        <ModalContent p='10px'>
          <ModalHeader> Add to your catalog</ModalHeader>
          <ModalCloseButton onClick={closeModal} />
          <p>Enter the details of the item you wish to add to your catalog. Click ADD when finished.</p>
          <form>
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

            <label for="photo">Photo <i>(Optional)</i></label>
            <HStack>
              <input
                placeholder="Link to photo"
                type="text"
                className="form-control"
                onChange={e => setPhoto(e.target.value)} />
            </HStack>

            <HStack>
              <p><i>Only tick this box below if you're willing to give away your item!</i></p>
              <label for="giveaway"></label>
              <input
                type="checkbox"
                value={giveaway}
                onChange={e => !setGiveaway(true)} />
            </HStack>

            <button onClick={onSubmitCreateListing} class="btn btn-primary">Add</button>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;