import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProfileModal from './miscellaneous/ProfileModal'
import { getSenderFull, getSender } from './Config/ChatLogics'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import "./style.css"
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client";
import Lottie from 'react-lottie'
import defaultOptions from "../animation/loader.json"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat({ setFetchAgain, fetchAgain }) {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(null); // Change to store the room ID
  const toast = useToast();

  const {  selectedChat, setSelectedChat, notification, setNotification, setNewMessage, newMessage } = ChatState();


const userData = localStorage.getItem('user')  



  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`
      );

      setMessages(data); 
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("error occured", error)
    }
  };  

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // useEffect(() => {
  //   socket?.on("message recieved", (newMessageRecieved) => {
  //     if (
  //       !selectedChatCompare ||
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //     ) {
  //       if (!notification.includes(newMessageRecieved)) {
  //         setNotification([newMessageRecieved, ...notification]);
  //         setFetchAgain(!fetchAgain);
  //       }
  //     } else {
  //       setMessages([...messages, newMessageRecieved]);
  //     }
  //   });
  // }, [notification, fetchAgain, selectedChatCompare, setNotification, setFetchAgain, setMessages, messages]);
  useEffect(() => {
    
    socket?.on("message recieved", (newMessageRecieved) => {
      console.log("this is newmess ===>", newMessageRecieved)
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        // Update the messages state with the new message
        setMessages(prevMessages => [...prevMessages, newMessageRecieved]);
      }
    });
  }, [notification, fetchAgain, selectedChatCompare, setNotification, setFetchAgain]);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    console.log("this is setup", userData)
    socket.on("connected", () => setSocketConnected(true));
    console.log("this is socketConnection",setSocketConnected(true))
    socket.on("typing", (room) => setIsTyping(room)); // Update to store the room ID
    socket.on("stop typing", () => setIsTyping(null));
  }, [userData]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        // const config = {
        //   headers: {
        //     "Content-type": "application/json",
        //     Authorization: `Bearer ${user.token}`,
        //   },
        // };
        setNewMessage("");
const uid = localStorage.getItem('myid')
        const { data } = await axios.post(
          "http://localhost:5000/api/message/",
          {
            content: newMessage,
            chatId: selectedChat,
            selfuserid:uid
          }
        
        );

        console.log("this is data ====>", data)
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // console.log("this is new message", e.target.value)

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(userData, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(userData, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {/* {selectedChat.chatName.toUpperCase()} */} hello
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping === selectedChat._id && (
                <div>
                  <div style={{ color: "green", fontWeight: "600" }}>Typing...</div>
                </div>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </div>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
