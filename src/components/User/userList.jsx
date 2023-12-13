import { Box, Text } from '@chakra-ui/react'
import React from 'react'

function userList({user, handleFunction}) {
  return (
    <>
    <Box 
        cursor={"pointer"}
        bg={"#E8E8E8"}
        _hover={{
            background:"#38B2AC",
            color:"#FFFFFF",
        }}
        w="100%"
        display={"flex"}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mb={2}
        borderRadius={"lg"}
        onClick={handleFunction}
    >
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize={"xs"}>
                <b>Email: </b>
                {user.email}
            </Text>
        </Box>
    </Box>
    </>
  )
}

export default userList