import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuItem, MenuList, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'; // Import the BellIcon from Chakra UI
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSender } from '../ChatLogics';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { Effect } from 'react-notification-badge';

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const navigate= useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

useEffect(()=>{
  handleSearch()
},[])
    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
      } = ChatState();

    const handleSearch = async () => {
        console.log("this is search",search)
        // if (!search) {
        //     alert("Please Enter something in search");
        //     return;
        // }


        try {
            setLoading(true);
      
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await axios.get(`https://cctlabs.in:7001/api/user/getallusersearch`, config);
      console.log(data)
      console.log(data[0].fullname)
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            alert("Error Occured!")
          }
        };



        const accessChat = async (userId) => {
            console.log(userId);
        
            try {
              setLoadingChat(true);
              const config = {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              };

              let selfuserid= localStorage.getItem('myid')
              
              const { data } = await axios.post(`http://localhost:5000/api/chat`, {otheruserId:userId,selfuserid });
        
              if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
              setSelectedChat(data);
              setLoadingChat(false);
              onClose();
            } catch (error) {
              alert("Error fetching the chat")
            }
          };



    
    // const {user} = ChatState()
    // console.log("this is user", user)

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
      };

    // const user = JSON.parse(localStorage.getItem("userInfo"));

    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                width="100%"
                padding="5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        {/* <i className="fas fa-search"></i> */} {/* Uncomment the icon if needed */}
                        <Text display={{ base: "none", md: "flex" }} paddingLeft={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    Talk-A-Tive
                </Text>


<div>
<Menu>
                    <MenuButton p={1}>
                    <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
                        <BellIcon fontSize="2xl" m={1}/>
                    </MenuButton>
                    <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
                </Menu>
                
                <Menu>
                <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
  <Avatar
    size="sm"
    cursor="pointer"
    name={user?.fullname} // Use optional chaining to safely access 'name'
    src={user?.pic} // Use optional chaining to safely access 'pic'
  />
</MenuButton>

            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
                

              <MenuDivider />
              <MenuItem onClick={logoutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
</div>
               
            </Box>





            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
          <Box display="flex" alignItems="center" pb={2}>
  <Input
    flex="1" // Use flex="1" to make the Input expand to fill the available space
    placeholder="Search by name or email"
    mr={2}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
                <Button onClick={handleSearch}>Go</Button>


</Box>

            {loading ? (
            //   <ChatLoading />
            'loading...'
            ) : (
              searchResult?.map((user) => (
                <div  key={user._id}
                  
                onClick={() => accessChat(user._id)} style={{display:"flex", flexDirection:"column" , background:"red", padding:"10px" , marginTop:"10px", marginBottom:"10px",color:"white", cursor:"pointer"}}> {user?.fullname} </div>

              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
        </div>
    );
}

export default SideDrawer;
