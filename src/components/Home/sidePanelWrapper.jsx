import React, { useState, useContext } from "react";
import ChatContext from "../../Context/chatContext";
import SidePanel from "../miscellaneous/sidePanel";
import { Box } from "@chakra-ui/react";

function SidePanelWrapper({fetchAgain, setFetchAgain}) {
  const { selectedChat } = useContext(ChatContext);
  // const [search, setSearch] = useState("");
  // const [searchResult, setSearchResult] = useState("");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SidePanel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
}

export default SidePanelWrapper;


