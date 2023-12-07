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
  Select,
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
        const description = item.descriptions + '\n\nIngredients: ' + item.ingredients;
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

  const handleAddToCart = (item) => {
    const newItem = {
      ...item,
      size: "Medium", // Default size
      ice: "Regular", // Default ice amount
      sugar: "Regular", // Default sugar amount
      adjustedPrice: parseFloat(item.price).toFixed(2) // Default adjusted price
    };
    setCartItems([...cartItems, item]); // Add the selected item to the cart
    setIsCartOpen(true); // Display the cart section when an item is added
  };

  const updateCartItem = (index, key, value) => {
    const updatedCartItems = [...cartItems];
    const item = updatedCartItems[index];
    item[key] = value;
  
    // Simple hardcoded price adjustments
    let priceAdjustment = 0;
    if(item.size === "Small") priceAdjustment -= 0.5;
    if (item.size === "Large") priceAdjustment += 0.5;
    if (item.ice === "Extra") priceAdjustment += 0.2;
    if (item.sugar === "Extra") priceAdjustment += 0.2;
  
    item.adjustedPrice = (parseFloat(item.price) + priceAdjustment).toFixed(2);
    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.adjustedPrice), 0); // Sum up the prices of all items in the cart
    return totalPrice.toFixed(2); // Return the total with two decimal places
  };

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear().toString().slice(-2); // Extract last two digits of the year
  
    return `${month}/${day}/${year}`;
  };

  const handleCheckout = async () => {
    let totalPrice = 0;

    // Loop through cartItems to calculate the total price
    cartItems.forEach((item) => {
      totalPrice += parseFloat(item.price);
    });

    // Creating the request body
    const requestBody = {
      id: uniqueId,
      totalAmount: totalPrice,
      orderDate: new Date().toISOString(),
      cashierName: 'Brady', 
      paymentMethod: selectedPaymentMethod, 
      time: new Date().toLocaleTimeString(),
    };

    fetch("https://bobaposapp.onrender.com/order/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or perform additional actions
        toast({ title: 'Checkout Successful', description: 'Order added to database', status: 'success', duration: 2500 });
        
        setUniqueId(uniqueId + 1);
        setCartItems([]);
        setShowCheckout(false);
      })
      .catch(() => {
        toast({ title: 'Checkout Failed', description: 'Failed to add order to database', status: 'error', duration: 2500 });
        console.log(JSON.stringify(requestBody));
      })
  };

  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleMenuboarddisplay = () => {
    navigate('/menuboard-display');
  };

  return (
    <Flex flexDirection="column">
    <Box background={"gray.800"} py={3}>
      <Heading as="h1" textAlign={'center'} color={'white'} fontFamily={'Roboto, sans-serif'}>Self Checkout</Heading>
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
          onClick={handleLogin}
          fontFamily='Varela Round'
          textTransform='uppercase'
          background='#D49D8F'
          padding='15px'
          color='#FFFFFF'
          fontSize='18px'
          marginTop={"10px"}
          marginBottom={"-60px"}
          _hover={{ background: '#C39B91' }}
        >
          Log In
        </Button>
        <Button
          onClick={handleMenuboarddisplay}
          fontFamily='Varela Round'
          textTransform='uppercase'
          background='#D49D8F'
          padding='15px'
          color='#FFFFFF'
          fontSize='18px'
          marginTop={"70px"}
          marginBottom={"30px"}
          _hover={{ background: '#C39B91' }}
        >
          Menu Board
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
                {/* Add to Cart Button */}
                <IconButton aria-label="Add to cart" icon={<AddIcon />} colorScheme="teal" onClick={() => handleAddToCart(item)}/>
        
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
      {cartItems.length > 0 && (
        <Box
          position="fixed"
          right="0"
          top="0"
          bottom="0"
          width="330px"
          bg="white"
          boxShadow="md"
          p="4"
          zIndex="1"
          maxH="100vh" // Set maximum height to 100% of the viewport height
          overflowY="auto" // Enable vertical scrolling
        >
          <Heading as="h3" size="md" mb="4" color="black">
            Cart
          </Heading>
          {cartItems.map((cartItem, index) => (
              <Flex key={index} direction="column" mb={4}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold">{cartItem.name}</Text>
                <IconButton
                  aria-label="Remove from cart"
                  icon={<CloseIcon />}
                  colorScheme="red"
                  onClick={() => {
                    const updatedCartItems = cartItems.filter((_, i) => i !== index);
                    setCartItems(updatedCartItems);
                  }}
                />
              </Flex>
              <Select
                placeholder="Size"
                defaultValue={cartItem.size}
                onChange={(e) => updateCartItem(index, "size", e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </Select>
              <Select
                placeholder="Ice"
                defaultValue={cartItem.ice}
                onChange={(e) => updateCartItem(index, "ice", e.target.value)}
              >
                <option value="None">No Ice</option>
                <option value="Less">Less Ice</option>
                <option value="Regular">Regular Ice</option>
                <option value="Extra">Extra Ice</option>
              </Select>
              <Select
                placeholder="Sugar"
                defaultValue={cartItem.sugar}
                onChange={(e) => updateCartItem(index, "sugar", e.target.value)}
              >
                <option value="None">No Sugar</option>
                <option value="Less">Less Sugar</option>
                <option value="Regular">Regular Sugar</option>
                <option value="Extra">Extra Sugar</option>
              </Select>
              <Text mt={2}>Price: ${cartItem.adjustedPrice}</Text>
            </Flex>
          ))}
          <Divider my={4} />
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" color="black">Total Price:</Text>
            <Text color="black">${calculateTotalPrice()}</Text>
          </Flex>
          <Button width="100%" colorScheme="blue" onClick={() => setShowCheckout(true)} aria-label="Proceed to Checkout">
            Checkout
          </Button>
        </Box>
      )}

      {showCheckout && (
        <Box
          className={showCheckout ? 'checkout-pane' : ''}
          position="fixed"
          right="0"
          top="0"
          bottom="5%"
          width="330px"
          bg="white"
          boxShadow="md"
          p="4"
          zIndex="2"  // Set a higher z-index to appear above the cart panel
        >
            <IconButton
            aria-label="Back to Cart"
            icon={<ArrowBackIcon />}  
            colorScheme="gray"
            position="absolute"
            top="4"
            right="4"
            onClick={() => setShowCheckout(false)}
          />
          {/* Checkout pane content */}
          <Heading as="h3" size="md" mb="4" color="black">
            Checkout
          </Heading>

              {/* Order Total */}
          <Text textAlign="center" fontWeight="bold" color="black" fontSize="xl" mb="2">
            Order Total:
          </Text>
          <Text textAlign="center" color="black" fontSize="2xl" mb="4">
            ${calculateTotalPrice()}
          </Text>

          {/* Payment options */}
          <HStack spacing={4} mt={4} justify="center">
            {/* Cash */}
            <Box
              width="70px"
              height="70px"
              bg={selectedPaymentMethod === 'cash' ? 'blue.200' : 'white'}
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => setSelectedPaymentMethod('cash')}
            >
            <Icon as={FaMoneyBill} size={30} aria-label="Cash Payment" color={selectedPaymentMethod === 'cash' ? 'white' : 'black'} />
              <Text mt="2" fontSize="sm">
                Cash
              </Text>
            </Box>

            {/* Card */}
            <Box
              width="70px"
              height="70px"
              bg={selectedPaymentMethod === 'card' ? 'blue.200' : 'white'}
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => setSelectedPaymentMethod('card')}
            >
            <Icon as={FaCreditCard} size={30} aria-label="Card Payment" color={selectedPaymentMethod === 'card' ? 'white' : 'black'} />
              <Text mt="2" fontSize="sm">
                Card
              </Text>
            </Box>

            {/* QR Code */}
            <Box
              width="70px"
              height="70px"
              bg={selectedPaymentMethod === 'qrCode' ? 'blue.200' : 'white'}
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => setSelectedPaymentMethod('qrCode')}
            >
            <Icon as={FaQrcode} size={30} aria-label="QR Code Payment" color={selectedPaymentMethod === 'qrCode' ? 'white' : 'black'} />
              <Text mt="2" fontSize="sm">
                QR Code
              </Text>
            </Box>
          </HStack>
          {/* Payment details */}
          {selectedPaymentMethod === 'card' && (
             <VStack spacing={4} mt={4}>
             <Input
               placeholder="Card Number"
             />
             <Input
               placeholder="Expiration Date"
             />
             <Input
               placeholder="CVV"
             />
             <Input
               placeholder="Card Type"
             />
           </VStack>
          )}

          {/* QR Code */}
          {selectedPaymentMethod === 'qrCode' && (
            <Box textAlign="center" mt="4">
              {/* Display fake QR Code */}
              <Image src="/rickroll.jpg" alt="You j got rick rolled!" />
            </Box>
          )}

          <Button width="95%" position="absolute" bottom="4" colorScheme="blue" onClick={handleCheckout}>
            Place Order
          </Button>
        </Box>
      )}

    </Flex>
    </Flex>
  );
};

export default MenuBoard;