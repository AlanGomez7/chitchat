import { Box, ButtonSpinner, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import ChatContext from "../../Context/chatContext";
import ChatsActionModal from "./chatsActionModal";
import { getSenderName } from "../../utils/utils";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import ScrollablePanel from "../miscellaneous/scrollablePanel";
import {io} from 'socket.io-client';
import UserProfileModal from "./UserProfileModal";

const ENDPOINT = 'http://localhost:3000'

var socket, selectedChatCompare
function sidePanel({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user, setSelectedChat } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping]=useState(false);
  const [isTyping, setIsTyping]=useState(false);

  const toast = useToast()


  useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on('connected', ()=>setSocketConnected(true))
    socket.on('typing', ()=>setIsTyping(true));
    socket.on('stop typing', ()=>setIsTyping(false));
  }, [user])



  const fetchMessage = async()=>{
    if(!selectedChat) return;
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: user._id
      }
    }  
    try {
      setMessages('') 
      const {data} = await axios.get(`http://localhost:3000/message/${selectedChat._id}`, config)

      setMessages(data)
      setIsLoading(false)

      socket.emit("join room", selectedChat._id)

    } catch (error) {
      toast({
        title: error.message,
        description: "Chat cannot be fetched",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }

  const sendMessage = async(event)=>{
    if(event.key === "Enter" && newMessage){
      socket.emit('stop typing', selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: userid
          }
        }
        setNewMessage("")
        const {data} = await axios.post('http://localhost:3000/message',{
          content: newMessage,
          chatId: selectedChat._id
        }, config)

        socket.emit("new message", data)
        setMessages([...messages, data])
        setIsLoading(false)
      } catch (error) {
        toast({
          title: error.message,
          description: "Chat cannot be send",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };
  const typeHandler = (e)=>{
    setNewMessage(e.target.value)

    if(!socketConnected) return

    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const typingStoped = new Date().getTime()
    const timerLength = 3000;

    setTimeout(()=>{
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - typingStoped
        if(timeDiff >= timerLength && typing){
          socket.emit('stop typing', selectedChat._id)
          setTyping(false);
        }
    }, timerLength) 
  };

  useEffect(()=>{
    fetchMessage()
    selectedChatCompare = selectedChat
  }, [selectedChat])


  useEffect(()=>{
    socket.on("message received", (newMessage)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id){
        // notifcation should be given
      }else{
        setMessages([...messages, newMessage])
      }
    })
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{base: "28px", md: "30px"}}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"heading"}
            display={"flex"}
            justifyContent={{base: "space-between"}}
            alignItems={"center"}
          >
            <IconButton 
              display={{base:"flex", md: "none"}}
              icon={<ArrowBackIcon/>}
              onClick={()=>setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
              </>
            ):(
              <>
                {selectedChat.chatName}
              </>
            )}

            {
              selectedChat.isGroupChat ? (
                <ChatsActionModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                ):(
                <UserProfileModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
              )
            }
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            padding={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"1000%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {isLoading ? (
            <Spinner
               alignSelf={"center"}
               margin={"auto"}
               width={20}
               height={20}
               size={"xl"}/>
               ):(
              <div className="messages">
                <ScrollablePanel messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>Typing...</div>: <></>}
              <Input
                variant={"filled"}
                placeholder="Enter a message"
                backgroundColor={"#E0E0E0"}
                onChange={(e)=>typeHandler(e)}
                value={newMessage}/>
            </FormControl>
          </Box>
        </>
      ):(
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
          <Text fontSize="3xl" pb={3} fontFamily="heading">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>

    
    
  );
}

export default sidePanel;
