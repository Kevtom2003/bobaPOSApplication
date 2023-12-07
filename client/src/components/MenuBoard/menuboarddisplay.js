// menuboard.js
import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import {
  Box,
  Heading,
  Divider,
  Card,
  Grid,
  GridItem,
  VStack,
  Button,
  Text,
  Image,
  Center,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Icon,
  PopoverHeader,
  PopoverBody,
  Input,
  HStack,
  Flex,  // Import Flex from Chakra UI for layout
} from "@chakra-ui/react";
import { AddIcon, InfoIcon, CloseIcon, ArrowBackIcon, } from "@chakra-ui/icons";
import { FaMoneyBill, FaCreditCard, FaQrcode} from "react-icons/fa";
import "./menuboard.css";
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const MenuBoard = () => {
  const [menuItemData, setMenuItemData] = useState([]);
  const [menuItemDescriptions, setMenuItemDescriptions] = useState([]);
  
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [menuItemIngredients, setMenuItemIngredients] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Manage cart section visibility
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [uniqueId, setUniqueId] = useState(0);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() =>{
  const fetchMenuData = async () => {
    try{
      const initialResult = await fetch(`https://bobaposapp.onrender.com/menudata/teaorders`);
      const jsonResult = await initialResult.json();
      setMenuItemIngredients(jsonResult.menuitemsingredients);
      setMenuItemData(jsonResult.menuitemsingredients);
      setMenuItemDescriptions(jsonResult.menuitemsingredients);
      const response = await fetch('https://bobaposapp.onrender.com/order/lastid');
      const lastIdData = await response.json();
      const lastId = lastIdData.lastId;
      setUniqueId(lastId + 1);
    } catch (error) {
      // Handle the error or try an alternative URL
      console.error('Error fetching menu data:', error);
      }
    }
    fetchMenuData();
  }, [])


  useEffect(() => {
    if (menuItemData.length !== 0 && menuItemDescriptions.length !== 0) {
      // Combine the data from menuItemData and menuItemDescriptions
      const newMenuItems = menuItemData.map((item) => {
        const description = item.descriptions + '\nIngredients: ' + item.ingredients;
        let category;
        category = item.categories
        let image;
        if(category == "Punch" || category == "Slush"){
          category = "Fruit";
          image = "/punchTea.jpg";
        }else if(category == "Milk Tea"){
          image = "milkTea.jpg";
        }else{
          image = "/seasonalTea.jpg"
        }
        return {
          name: item.tea_name,
          image, // You can set the image path here
          category, // Set the category as needed
          description,
          price:item.price
        };
      });
      const filteredItems = selectedCategory
      ? newMenuItems.filter((item) => item.category === selectedCategory)
      : newMenuItems;

    setFilteredItems(filteredItems);
    }
  }, [menuItemData, menuItemDescriptions,selectedCategory]);

  const handleFilterCategory = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };


  return (
    <div style={{zoom : "110%"}}>
    <Flex flexDirection="column">
    <Box background={"gray.800"} py={3}>
      <Heading as="h1" textAlign={'center'} color={'white'} fontFamily={'Roboto, sans-serif'}>Menu Board</Heading>
    </Box>
    <Flex alignItems="flex-start" bg="gray.800">
      {/* Left Side */}
      <Center w="20%" display="flex" flexDirection="column">
        {/* Kung Fu Tea Logo */}
        <Image
            src='/kungfutealogo.png'   // Adjust the image path as needed
            alt='Kung Fu Tea Logo'
            boxSize="125px"             // Reduce the size of the image
            objectFit="contain" 
            textAlign="center"  
            borderRadius="md"
            boxShadow="md"   
            mb={4}  
            mt = {20}  
        />
        <Button
          onClick={() => navigate(-1)}
          fontFamily='Varela Round'
          textTransform='uppercase'
          background='#D49D8F'
          padding='15px'
          color='#FFFFFF'
          fontSize='18px'
          marginTop={"10px"}
          marginBottom={"30px"}
          _hover={{ background: '#C39B91' }}
        >
          Go Back
        </Button>
          
        {/* Category Cards */}
        
        <Card
        borderRadius="lg"      // Add rounded edges
        boxShadow="md"    
        boxSize="155px"
        mb={5}     // Add a small drop shadow
        height='auto'
        >
        <Image
            src='/milkTea.jpg'   // Adjust the image path as needed
            alt='Milk Tea'
            objectFit="cover" 
            textAlign="center"
            borderRadius="md"
            boxShadow="md"
        />
        <Divider />
        {/* <Text>Freshly brewed teas paired with milk powder</Text> */}
        <Button 
        variant={selectedCategory === "Milk Tea" ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => handleFilterCategory("Milk Tea")}
        align="start"
        aria-label="Filter Milk Tea">
            Filter
        </Button>
        </Card>

        <Card
        borderRadius="lg"      // Add rounded edges
        boxShadow="md"    
        boxSize="155px"
        mb={5}     // Add a small drop shadow
        height='auto'
        >
        <Image
            src='/punchTea.jpg'   // Adjust the image path as needed
            alt='Punch Tea'
            objectFit="cover" 
            textAlign="center"
            borderRadius="md"
            boxShadow="md"
        />
        <Divider />
        {/* <Text>Freshly brewed teas paired with milk powder</Text> */}
        <Button variant={selectedCategory === "Fruit" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => handleFilterCategory("Fruit")}
          align="start"
          aria-label="Filter Punch Tea">
            Filter
        </Button>
        </Card>

        <Card
        borderRadius="lg"      // Add rounded edges
        boxShadow="md"    
        boxSize="155px"
        mb={5}     // Add a small drop shadow
        height='auto'
        >
        <Image
            src='/seasonalTea.jpg'   // Adjust the image path as needed
            alt='Seasonal Tea'
            objectFit="cover" 
            textAlign="center"
            borderRadius="md"
            boxShadow="md"
        />
        <Divider />
        {/* <Text>Freshly brewed teas paired with milk powder</Text> */}
        <Button variant={selectedCategory === "Classic" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => handleFilterCategory("Classic")}
          align="start"
          aria-label="Filter Classic Tea">
            Filter
        </Button>
        </Card>
      </Center>

      {/* Right Side */}
      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap={4} // Reduced the gap to decrease the space between rows
        pl={6} // Left padding to ensure some space from the left side
        pb = {8}
        pt={10} // Increased the top padding
        pr={cartItems.length > 0 ? 320 : 8} // Adjust the right padding based on whether the cart is open or not
        w="full" // Ensure the grid takes full width of the right side
      >
        {filteredItems.map((item, index) => (
          <GridItem key={index} colSpan={1}>
          <Card borderRadius="lg" overflow="hidden" display="flex" flexDirection="column" position="relative">
            {/* Display the image for the drink */}
            <Image src={item.image} alt={item.name} boxSize="100%" objectFit="cover" />
                      
            {/* Product Name */}
            <Box p={3} d="flex" flexDirection="column" justifyContent="space-between" flexGrow={1}>
              <Text fontWeight="bold" textAlign="center" color="black">{item.name}</Text>
              <Flex justifyContent="center" alignItems="center" mt={2}>        
                {/* Description Popover */}
                <Popover placement="bottom" strategy="fixed">
                  <PopoverTrigger>
                    <IconButton aria-label={`Description of ${item.name}`} icon={<InfoIcon />} colorScheme="teal" ml={2} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton aria-label="Close description"/>
                    <PopoverHeader color="black">Description of {item.name}</PopoverHeader>
                    {/* This is where the description will show */}
                    <PopoverBody color="black">{item.description}</PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            </Box>
          </Card>
        </GridItem>
        ))}
      </Grid>
    </Flex>
    </Flex>
    </div>
  );
};

export default MenuBoard;