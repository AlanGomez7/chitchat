import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Home/SideDrawer";
import ChatContext from "../Context/chatContext";
import SidePanelWrapper from "../components/Home/sidePanelWrapper";
import SingleChat from "../components/Home/singleChat";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate()
  const {setUser, user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)
    if(!userInfo){
      navigate('/')
    }

}, [])
  return (
    <div className="w-full">
      <SideDrawer/>
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <SingleChat fetchAgain={fetchAgain}/>}
        {user && <SidePanelWrapper fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}

export default Chat;
