import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    // const toast = useToast();
    // const history = useHistory();
    const navigate = useNavigate();
    // const [name, setName] = useState();
    const [email, setEmail] = useState();
    // const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    // const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);


    const [loading, setLoading] = useState(false);


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
          alert('please fill all the field')
          setLoading(false);
          return;
        }
    
        try {
          
    
          const { data } = await axios.post(
            "http://localhost:5000/api/user/login",
            { email, password }
            
          );
    
         alert('Login Successful')
        //   setUser(data);
        console.log("this is your data",data)
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          //  navigate("/chats");
        } catch (error) {
          alert('Error Occured!')
          setLoading(false);
        }
      };



  return (
    <VStack spacing="5px">
    {/* <FormControl id="first-name" isRequired>
      <FormLabel>Name</FormLabel>
      <Input
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
    </FormControl> */}
    <FormControl id="email" isRequired>
      <FormLabel>Email Address</FormLabel>
      <Input
        type="email"
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup size="md">
        <Input
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    
    {/* <FormControl id="password" isRequired>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup size="md">
        <Input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl> */}
    {/* <FormControl id="pic">
      <FormLabel>Upload your Picture</FormLabel>
      <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
      />
    </FormControl> */}
    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={picLoading}
    >
      Sign Up
    </Button>
  </VStack>
  )
}

export default Login
