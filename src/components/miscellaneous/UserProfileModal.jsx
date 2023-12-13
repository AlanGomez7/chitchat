import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

function UserProfileModal({ fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton onClick={onOpen} icon={<HamburgerIcon />}></IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            <Box
              width={"150px"}
              height={"150px"}
              borderRadius={"100%"}
              backgroundColor={"black"}
            ></Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserProfileModal;
