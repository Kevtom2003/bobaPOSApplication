import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Input,
  Button,
  Text,
  extendTheme,
} from '@chakra-ui/react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('College Station'); // Set default city

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=4daab2a267f0a71ed3b614f2e168abfa`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
      }
    };

    fetchWeatherData();
  }, [city]);

  const handleLogin = () => {
    if (username === 'manager' && password === 'manager') {
      navigate('/manager-dashboard');
    } else if (username === 'customer' && password === 'customer') {
      navigate('/');
    } else if (username === 'cashier' && password === 'cashier') {
      navigate('/cashier');
    } else {
      alert('Invalid username or password.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="881293908310-52t5ht6pc84gr01iklt9bjr8voh7ng85.apps.googleusercontent.com">
    <ChakraProvider theme={customTheme}>
          {/* Skip Links */}
          <Box position="absolute" top="-40px" left="0" zIndex="100">
            <Button
              as="a"
              href="#weather-text" 
              onFocus={(e) => (e.target.style.position = 'static')}
              onBlur={(e) => (e.target.style.position = 'absolute')}
              variant="ghost"
            >
              Skip to main content
            </Button>
          </Box>
      <Box className='weather-text' aria-label="Weather Information" role="form" textAlign='center' marginTop='10px'>
        <Input
          type='text'
          placeholder='Enter City'
          aria-label='Enter City'
          value={city}
          onChange={handleCityChange}
          fontFamily='Varela Round'
          background='#2D3748'
          color='white'
          marginBottom='15px'
          padding='15px'
          top= '95px'
        />
      </Box>
      {weatherData && (
            <>
              <Text className='weather-text' style={{ top: '135px' }}>City: {weatherData.name}</Text>
              <Text className='weather-text' style={{ top: '165px' }}>Current Temperature: {weatherData.main.temp}°F</Text>
              <Text className='weather-text' style={{ top: '195px', color: 'red' }}>High: {weatherData.main.temp_max}°F <Text color="blue" display="inline">Low: {weatherData.main.temp_min}°F</Text></Text>
              <Text className='weather-text' style={{ top: '225px' }}>Wind: {weatherData.wind.speed} mph</Text>
              <Text className='weather-text' style={{ top: '255px' }}>Feels Like: {weatherData.main.feels_like}°F</Text>
              <Text className='weather-text' style={{ top: '285px' }}>Description: {weatherData.weather[0].description}</Text>
            </>
          )}
      <Box role="form" aria-label="Login Form" className='login-page' width='360px' padding='8% 0 0' margin='auto'>
        <Box
          className='form'
          position='relative'
          zIndex='1'
          background='#1A202C'
          maxW='360px'
          margin='0 auto 100px'
          padding='45px'
          textAlign='center'
        >
          <Text
            fontFamily='Varela Round'
            fontSize='40px'
            fontWeight='bold'
            color='#FFFFFF'
            marginBottom='10px'
            as='h1'
          >
            Kung Fu Tea
          </Text>
          <Box as='form' className='login-form'>
            <Input
              type='text'
              placeholder='Username'
              aria-label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fontFamily='Varela Round'
              background='#2D3748'
              color='white'
              marginBottom='15px'
              padding='15px'
            />
            <Input
              type='password'
              placeholder='Password'
              aria-label='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fontFamily='Varela Round'
              background='#2D3748'
              color='white'
              marginBottom='15px'
              padding='15px'
            />
            <Button
              onClick={handleLogin}
              fontFamily='Varela Round'
              textTransform='uppercase'
              background='#D49D8F'
              padding='15px'
              color='#FFFFFF'
              fontSize='18px'
              marginBottom={"10px"}
              _hover={{ background: '#C39B91' }}
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate("/")}
              fontFamily='Varela Round'
              textTransform='uppercase'
              background='#D49D8F'
              padding='15px'
              color='#FFFFFF'
              fontSize='18px'
              marginBottom={"10px"}
              _hover={{ background: '#C39B91' }}
            >
              Back to self-checkout
            </Button>
            <GoogleLogin
              onSuccess={credentialResponse => {
                const USER_CREDENTIAL = jwtDecode(credentialResponse.credential);
                console.log(USER_CREDENTIAL);
                const { name, email } = USER_CREDENTIAL;
                const message = `Welcome, Manager ${name}! \nYour email is ${email}.`;
                alert(message);
                navigate('/manager-dashboard');
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
    </GoogleOAuthProvider>
  );
}

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'white',
        fontFamily: 'Roboto, sans-serif',
      },
      '.weather-text': {
        position: 'absolute',
        top: 0,
        color: 'white',
        textAlign: 'center',
        margin: 5,
      },
    },
  },
});

export default Login;