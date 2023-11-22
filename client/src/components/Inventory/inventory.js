import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Divider,
  Card,
  Grid,
  GridItem,
  VStack,
  HStack,
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
  PopoverHeader,
  PopoverBody,
  Flex,  // Import Flex from Chakra UI for layout
  UnorderedList,
   ListItem,
   Icon,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
} from "@chakra-ui/react";
import { FaDollarSign, FaReceipt, FaUsers } from 'react-icons/fa';
import "./inventory.css";

function Inventory() {
  const navigate = useNavigate();
  const [inventoryIDS, setInventoryIDS] = useState([]);
  const [inventoryQuantity, setInventoryQuantity] = useState([]);
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [inventoryMinimum, setInventoryMinimum] = useState([]);
  const[inventoryItems, setInventoryItems] = useState([]);
  useEffect(() =>{
    const fetchInventoryIDS = async () => {
      try{
      const initialResult = await fetch(`http://54.92.197.133/inventory/itemid`);
      const jsonResult = await initialResult.json();
      setInventoryIDS(jsonResult.inventoryids);
      } catch (error) {
        // Handle the error or try an alternative URL
        console.error('Error fetching inventory ID data:', error);
        // Attempt an alternative URL
        try {
          const initialResult = await fetch(`http://localhost:5001/inventory/itemid`);
          const jsonResult = await initialResult.json();
          setInventoryIDS(jsonResult.inventoryids);
        } catch (alternativeError) {
          console.error('Error fetching inventory ID data from the alternative URL:', alternativeError);
        }
      }
    }

    const fetchInventoryQuantity = async () => {
      try{
      const initialResult = await fetch(`http://54.92.197.133/inventory/quantity`);
      const jsonResult = await initialResult.json();
      setInventoryQuantity(jsonResult.inventoryquantity);
    } catch (error) {
      // Handle the error or try an alternative URL
      console.error('Error fetching quantity data:', error);
      // Attempt an alternative URL
      try {
        const initialResult = await fetch(`http://localhost:5001/inventory/quantity`);
        const jsonResult = await initialResult.json();
        setInventoryQuantity(jsonResult.inventoryquantity);
      } catch (alternativeError) {
        console.error('Error fetching quantity data from the alternative URL:', alternativeError);
      }
    }
    }
  const fetchInventoryCategory = async () => {
    try{
      const initialResult = await fetch(`http://54.92.197.133/inventory/itemcategory`);
      const jsonResult = await initialResult.json();
      setInventoryCategories(jsonResult.inventorycategories);
      } catch (error) {
        // Handle the error or try an alternative URL
        console.error('Error fetching category data:', error);
        // Attempt an alternative URL
        try {
          const initialResult = await fetch(`http://localhost:5001/inventory/itemcategory`);
          const jsonResult = await initialResult.json();
          setInventoryCategories(jsonResult.inventorycategories);
        } catch (alternativeError) {
          console.error('Error fetching category data from the alternative URL:', alternativeError);
        }
      }
    }
    const fetchInventoryMinimum = async () => {
      try{
        const initialResult = await fetch(`http://54.92.197.133/inventory/minimumamount`);
        const jsonResult = await initialResult.json();
        setInventoryMinimum(jsonResult.inventoryminimum);
        } catch (error) {
          // Handle the error or try an alternative URL
          console.error('Error fetching minimum data:', error);
          // Attempt an alternative URL
          try {
            const initialResult = await fetch(`http://localhost:5001/inventory/minimumamount`);
            const jsonResult = await initialResult.json();
            setInventoryMinimum(jsonResult.inventoryminimum);
          } catch (alternativeError) {
            console.error('Error fetching minimum data from the alternative URL:', alternativeError);
          }
        }
      }
    fetchInventoryCategory();
    fetchInventoryIDS();
    fetchInventoryMinimum();
    fetchInventoryQuantity();
  }, [])
  
  const handleLogout = () => {
    navigate("/");
  };

  const TableRow = ({ data, borderBottom = true }) => (
    <Tr>
      {data.map((item, index) => (
        <Td key={index} borderBottom={borderBottom ? "1px solid #E2E8F0" : "none"} color="blackAlpha.900">
          {item}
        </Td>
      ))}
    </Tr>
  );

  useEffect(() => {
    if(inventoryIDS.length !== 0){
      const newInventoryItem = inventoryIDS.map((item, index) =>{
        const quantity = inventoryQuantity[index].quantity;
        const category = inventoryCategories[index].itemcategory;
        const minimum = inventoryMinimum[index].minimumamount;
        return{
          id: item.itemid,
          quantity,
          category,
          minimum
        };
      });
      setInventoryItems(newInventoryItem);
    }
  }, [inventoryIDS,inventoryQuantity,inventoryCategories,inventoryMinimum]);
  

  return (
 <Flex >
    <Box display="flex" width="200px">
      <Box className="sidebar" backgroundColor="#1A202C" color="#FFFFFF" height="100vh" width="200px" p="20px" >
      <Image
            src='/kungfutealogo.png' borderRadius="lg" mb={6}
        />
        <UnorderedList styleType="none" p="0">
          <ListItem mb="15px" fontSize="lg">
            <a href="/manager-dashboard">Dashboard</a>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <a href="/manager-dashboard">Orders</a>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <a href="/manager-dashboard">Inventory</a>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <a href = "/menuboard">
              Menu
            </a>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <a href="/manager-dashboard">Employees</a>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <a href="/" onClick={handleLogout}>
              Log out </a>
          </ListItem>
        </UnorderedList>
      </Box>
      </Box>
      {/* Right-side content */}
      <Flex direction="column" flex="10" bg="#F2F2F2"  minHeight="100vh" pb={10}> 
      <HStack
        flex="1"
        pt={-10}  // Adjust the padding-top as needed
        pb={-5}
        spacing={3}  // Adjust the spacing as needed
        align="center"
        color="white"
        justifyContent="center"
      >
        <Box w="32%" bg="blue.900" ml={6} mr={4} borderRadius="lg" h="140px">
          <Center
            w="40px"
            h="58px"
          >
            <Icon as={FaDollarSign} fontSize="2xl" color="white" ml={3} />
          </Center>
          <Text fontSize="l" textAlign="center" ml={3} ><a href="/menuinfo">Menu</a></Text>
        </Box>

        <Box w="32%"  bg="blue.900" ml={4} mr={4} borderRadius="lg" h="140px">
          <Center
            w="40px"
            h="58px"
            borderRadius="lg"
          >
            <Icon as={FaReceipt} fontSize="2xl" color="white" ml={3}/>
          </Center>
          <Text fontSize="l" textAlign="center" ml={3}><a href="/inventory">Inventory</a></Text>
        </Box>

        <Box w="32%"  bg="blue.900" ml={4} mr={4} borderRadius="lg" h="140px">
          <Center
            w="40px"
            h="58px"
            borderRadius="lg"
          >
            <Icon as={FaUsers} fontSize="2xl" color="white" ml={3}/>
          </Center>
          <Text fontSize="l" textAlign="center" ml={3}><a href="/employees">Employees</a></Text>
        </Box>
      </HStack>
        {/* Table */}
        <Box w="96%" bg="white" border="1px solid #E2E8F0" p={10} mx="auto">
          <Heading as="h2" fontSize="xl" mb={8} color="blackAlpha.900">
            Inventory Details
          </Heading>
          <Table variant="simple" borderCollapse="separate">
            <Thead>
              <Tr>
                <Th>Item ID</Th>
                <Th>Quantity</Th>
                <Th>Item Category</Th>
                <Th>Minimum Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
          {/* Use the TableRow component to render rows */}
          {inventoryItems.map((item, index) => (
          <TableRow key = {index} data={[item.id, item.quantity, item.category, item.minimum]} />
          ))}
          {/* Add more rows as needed */}
            </Tbody>
          </Table>
        </Box>
        </Flex>
    </Flex>
  );
}

export default Inventory;