import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import ChatContext from "../../Context/chatContext";
import UserBadge from "../User/userBadge";
import UserList from "../User/userList";
import {Spinner} from "@chakra-ui/spinner"
import axios from "axios";

function chatsActionModal({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user, setSelectedChat } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const [name, setName] = useState("");
  const Toast = useToast()


  const handleSearch = async (query) => {
    setLoading(true);
    setSearch(query);
    if (!query) return;
    try {
      const config = {
        headers: {
          Authorization: user._id,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/search?search=${search}`,
        config
      );
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupName = async() => {
    setRenameloading(true);
    if(name.length < 3){
      Toast({
        title: "Group name must be at least 3 characters",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      setRenameloading(false)
      return
    }

    try {
      const {data} = await axios.put('http://localhost:3000/chat/rename',{
        chatId: selectedChat._id,
        chatName: name
      })

      if(!data){
        throw new Error("data not received!")
      }
      
      setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setRenameloading(false);


    } catch (error) {
      Toast({
        title: "something went wrong...",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
  };
  const removeUser = async(userToRemove) => {

    if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      Toast({
        title: "Only admins can remove users",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      return
    }
    const userId = userToRemove._id;
    try{
      const {data} = await axios.put('http://localhost:3000/chat/remove-user', {
          chatId: selectedChat._id,
          userId
      })
      user._id === userToRemove._id ? setSelectedChat():setSelectedChat(data)
      setFetchAgain(!fetchAgain)

    }catch(error){
      Toast({
        title: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
  };

  const addUser = async(userToAdd) => {
    if(selectedChat.users.find(u => u._id === userToAdd._id)){
      Toast({
        title: "user is already in this group",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      return
    }

    if(selectedChat.groupAdmin._id !== user._id){
      Toast({
        title: "Only admins can add users",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      return
    }

    try{
      const {data} = await axios.put('http://localhost:3000/chat/add-user', {
          chatId: selectedChat._id,
          userId: userToAdd
      })
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
    }catch(error){
      Toast({
        title: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
  };

  return (
    <>
      <IconButton onClick={onOpen} icon={<HamburgerIcon />}></IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flexWrap={"wrap"} width={"100%"}>
              {selectedChat?.users.map((u) => (
                <UserBadge
                  user={u}
                  key={u._id}
                  handleFunction={() => removeUser(u)}
                />
              ))}
            </Box>
            <FormControl marginY={2} display={"flex"}>
              <Input placeholder="Update Group Name" onChange={(e)=>setName(e.target.value)} value={name}/>
              <Button onClick={()=>handleGroupName(name)} backgroundColor={"#38B2AC"} color={"white"} ml={2} isLoading={renameloading}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                mb={3}
              />
              {loading ? (
                <Spinner size={"lg"}/>
              ) : (
                searchResults?.map((user) => (
                  <UserList
                    user={user}
                    key={user._id}
                    handleFunction={() => addUser(user)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {/* <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
            <Button bg={"red"} color={"white"}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default chatsActionModal;
