import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuItem,
  MenuButton,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import ChatContext from "../../Context/chatContext";
import ChatLoading from "../miscellaneous/chatLoading";
import UserList from "../User/userList";
import {Spinner} from "@chakra-ui/spinner"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SideDrawer() {
  const { user, setSelectedChat, chat, setChat } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const navigate = useNavigate()

  const logoutHandler = ()=>{
    localStorage.removeItem('userInfo')
    navigate('/')
  }
  
  const handleClick = async(userId) => {
    try {

      setLoadingChat(true)
      const {data} = await axios.post('http://localhost:3000/chat',{_id: userId, currentUser: user._id})
      setChat([data, ...chat])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search term",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: user._id
        }
      }
      const {data} = await axios.get(`http://localhost:3000/search?search=${search}`, config)
      if(data.length > 0){
        setLoading(false);
        setSearchResult(data);
      } else {
        toast({
          title: "User doesn't exist",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
     }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "warning", 
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        className="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p="5px, 10px, 5px, 10px"
        shadow={"base"}
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" mx={"2"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} m="2">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} mr={"14"}>
          ChitChat
        </Text>
        <Menu>
          <MenuButton onClick={()=>logoutHandler()}>
            <MenuItem color={"red"} p={"4"}>
              Logout
            </MenuItem>
          </MenuButton>
        </Menu>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} ml={2}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => <UserList user={user} key={user._id} handleFunction={()=>handleClick(user._id)} />)
            )}
          { loadingChat&&<Spinner/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
