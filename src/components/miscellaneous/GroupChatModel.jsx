import { 
  Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import ChatContext from '../../Context/chatContext';
import axios from 'axios';
import UserList from '../User/userList'
import UserBadge from '../User/userBadge';

function GroupChatModel({children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const Toast = useToast();
  const {user, setChat, chat} = useContext(ChatContext); 

  const handleGroup = async(userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
      Toast({
        status: 'error',
        description: 'User already added',
        duration: 3000,
        isClosable: true,
        position: 'top-left'
      })
      return
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleSearch = async(query)=>{
    setSearch(query)
    if(!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization : user._id
        }
      }
      const {data} = await axios.get(`http://localhost:3000/search?search=${search}`, config)
      setLoading(false)
      setSearchResults(data)
    } catch (error) {
      Toast({
        title: "Something went wrong...",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left'
      })
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter(usr => usr._id !== deleteUser._id))
  };

  const handleSubmit = async()=>{
    if(!groupName){
      setError(true)
      return
    }
    const config = {
      headers: {
        Authorization: user._id
      }
    }
    try {
      const {data} = await axios.post('http://localhost:3000/chat/group', {
        name: groupName,
        user: JSON.stringify(selectedUsers.map(u => u._id))
      }, config)
      setChat([data, ...chat])
      onClose()

    } catch (error) {
      Toast({
        status: 'error',
        description: 'Unable to create group chat',
        duration: 3000,
        isClosable: true,
        position: 'top-left'
      })
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader fontSize={"35px"} fontFamily={"heading"}
          display={"flex"} justifyContent={"center "}>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input placeholder='Chat Name' mb={3} onChange={(e)=>setGroupName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <Input placeholder='Add Users eg: Alan, Jane...' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map(u => <UserBadge key={u._id} user={u} handleFunction={()=>handleDelete(u)} />)}
            </Box>
            {loading? <div>Loading....</div>:(
              searchResults?.map(user => <UserList key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>)
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit} >Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel