import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

function userBadge({user, handleFunction}) {
  return (
        <Box
            px={2}
            py={1}
            ml={2}
            mt={2}
            borderRadius={"lg"}
            mb={2}
            fontSize={12}
            bgColor={"purple"}
            color={"white"}
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon ml={1} cursor={"pointer"} />
        </Box>
    )
}

export default userBadge