import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

const Signup = () => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInput = useRef();

  const handleClick = () => {
    setShow((prev) => !prev);
  };

  const uploadPicture = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: 'Please select an image to upload',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    // Check if image type is jpg, jpeg or png
    if (pic.type.match(/image\/(jpeg|JPEG|jpg|JPG|png|PNG)/)) {
      const formData = new FormData();
      formData.append('file', pic);
      formData.append('upload_preset', 'mern-chat-app');
      formData.append('cloud_name', 'dbbadyj4u');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dbbadyj4u/image/upload',
          {
            method: 'post',
            body: formData,
          }
        );
        const uploadData = await response.json();
        setLoading(false);
        setPic(uploadData.url.toString());
      } catch (e) {
        setLoading(false);
        console.log(e.message);
      }
    } else {
      setLoading(false);
      toast({
        title: 'Please select a valid image(png,jpg,jpeg)',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please enter all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Password and Confirm Password does not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/v1/user', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          pic,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setLoading(false);
      localStorage.setItem('user', JSON.stringify(data));
      resetControls();
    } catch (e) {
      setLoading(false);
      console.log(e.message);
    }
  };

  const resetControls = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPic('');
    setShow(false);
    // Rest file input
    if (fileInput.current) {
      fileInput.current.value = '';
      fileInput.current.type = 'text';
      fileInput.current.type = 'file';
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl isRequired id='name'>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired id='signupEmail'>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired id='signupPassword'>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            value={password}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired id='confirmPassword'>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            value={confirmPassword}
            placeholder='Confirm your password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/*'
          ref={fileInput}
          onChange={(e) => uploadPicture(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
