import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import Chatbox from "../Components/ChatBox";





const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const { user } = ChatState() || {}; // Ensure user is defined

  return (
    <div style={{ width: "100%" }}>
    {user && <SideDrawer />}
    <Box display="flex" flexDirection="row" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && (
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </Box>
  </div>
  );
};

export default Chatpage;
