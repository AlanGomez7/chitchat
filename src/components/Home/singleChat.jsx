import React, { useState, useContext, useEffect } from "react";
import ChatContext from "../../Context/chatContext";
import { Box, Stack, useToast, Text, Spinner } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import { getSenderName } from "../../utils/utils";
import GroupChatModel from "../miscellaneous/GroupChatModel";
import axios from "axios";

function singleChat({ fetchAgain }) {
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat, chat, setChat } = useContext(ChatContext);
  console.log(selectedChat)
  const toast = useToast();

  const setUsers = (u)=>{
    setSelectedChat(u)
  }
  const fetchChat = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (Object.keys(user).length > 0) {
        const id = user._id;
        if (id) {
          const { data } = await axios.post(
            "http://localhost:3000/chat/fetch-chat",
            { id },
            config
          );
          setLoading(false);
          setChat(data);
        }
      } else {
        setLoading(true);
      }
    } catch (e) {
      toast({
        title: e.message,
        description: "Chat cannot be send",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
    }, [user, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"heading"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            create group
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"90%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {!loading ? (
          <Stack w={"100%"} overflowY={"scroll"}>
            {chat.map((chat) => (
              <Box
                onClick={() => setUsers(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSenderName(loggedInUser, chat?.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Spinner width={"50px"} height={"50px"} alignSelf={"center"} ml={"40%"}/> 
        )}
      </Box>
    </Box>
  );
}

export default singleChat;
