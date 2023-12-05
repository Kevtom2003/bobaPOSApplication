import React, {useState, useEffect} from "react";
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
import "./menuinfo.css";
import MenuinfoCRUD from "../CRUDComponents/MenuinfoCRUD";
import { useToast } from "@chakra-ui/react";

function Menuinfo() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  const handleEmployee = () => {
    navigate("/employees");
  };
  const handleInventory = () => {
    navigate("/inventory");
  };
  const handleMenuInfo = () => {
    navigate("/menuinfo");
  };
  const handleDashboard = () => {
    navigate("/manager-dashboard");
  };
  const handleReport = () => {
    navigate("/salesreport");
  };
  const [menuinfoItems, setMenuinfoItems] = useState([]);
  const [handleMenuinfoUpdate, setMenuinfoUpdate] = useState(false);
  const toast = useToast();

  useEffect(() =>{
    const fetchMenuinfo = async () => {
      try{
        const initialResult = await fetch(`https://bobaposapp.onrender.com/menuinfo/data`);
        const jsonResult = await initialResult.json();
        setMenuinfoItems(jsonResult);
      } catch (error) {
        // Handle the error or try an alternative URL
        console.error('Error fetching menu ID data:', error);
      }
    }
    fetchMenuinfo();
  }, [handleMenuinfoUpdate])



  const handleCrudButtonClick = () => {
    setMenuinfoUpdate((prevValue) => !prevValue);
    toast({ title: 'Operation Success', description: 'Database modified', status: 'success', duration: 2500 });
  }

  const TableRow = ({ data, borderBottom = true }) => (
    <Tr>
      {data.map((item, index) => (
        <Td key={index} borderBottom={borderBottom ? "1px solid #E2E8F0" : "none"} color="blackAlpha.900">
          {item}
        </Td>
      ))}
    </Tr>
  );


  

  return (
 <Flex >
    <Box display="flex" width="200px">
      <Box className="sidebar" backgroundColor="#1A202C" color="#FFFFFF" height="100vh" width="200px" p="20px" >
      <Image
            src='/kungfutealogo.png' alt="Kung Fu Tea Logo" borderRadius="lg" mb={6} mt={10}
        />
        <UnorderedList styleType="none" p="0">
          <ListItem mb="15px" fontSize="lg">
            <Button onClick={handleDashboard} variant="unstyled">Dashboard</Button>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <Button onClick={handleInventory} variant="unstyled">Inventory</Button>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <Button onClick={handleMenuInfo} variant="unstyled">Menu</Button>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
           <Button onClick={handleEmployee} variant="unstyled">Employees</Button>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <Button onClick={handleReport} variant="unstyled">SalesReport</Button>
          </ListItem>
          <ListItem mb="15px" fontSize="lg">
            <Button onClick={handleLogout} variant="unstyled">Log out</Button>
          </ListItem>
        </UnorderedList>
      </Box>
      </Box>
      {/* Right-side content */}
      <Flex direction="column" flex="10" bg="#F2F2F2"  minHeight="100vh" pb={10} mt={5}> 
      <HStack
        flex="1"
        pt={-10}  // Adjust the padding-top as needed
        pb={5}
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
        <Flex w="96%" bg="white" border="1px solid #E2E8F0" p={10} mx="auto" alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
          <Heading as="h2" fontSize="xl" mb={8} color="blackAlpha.900">
            Menu Information
          </Heading>
          <Table variant="simple" borderCollapse="separate">
            <Thead>
              <Tr>
                <Th scope="col">Item ID</Th>
                <Th scope="col">Item Name</Th>
                <Th scope="col">Price</Th>
                <Th scope="col">Ingredients</Th>
                <Th scope="col">Description</Th>
                <Th scope="col">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
          {/* Use the TableRow component to render rows */}
          {menuinfoItems.map((item, index) => (
          <TableRow key = {index} data={[item.id, item.tea_name, item.price, item.ingredients, item.descriptions, item.categories]} />
          ))}
          {/* Add more rows as needed */}
            </Tbody>
          </Table>
          <MenuinfoCRUD onUpdate={handleCrudButtonClick}></MenuinfoCRUD>
        </Flex>
        </Flex>
    </Flex>
  );
}

export default Menuinfo;