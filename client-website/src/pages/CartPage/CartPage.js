


import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, List, ListItem, ListItemText, TableHead, TableRow, Button, IconButton, Box, Modal, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Divider, Typography } from 'antd';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Redo } from '@mui/icons-material';
import paymentIcon from "../../assests/icons/payments.png";
import { useNavigate } from 'react-router-dom';
import easypaisa from "../../assests/icons/easy-paisa.png";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const [editItem, setEditItem] = useState(null); // Track which item is being edited
  const [editModalOpen, setEditModalOpen] = useState(false); // Control modal visibility


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);
  const handleQuantityUpdate = (id, operation) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = operation === "increment" ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Open edit modal with selected item data
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };


  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <React.Fragment>
    <Navbar/>
    <Box py={4} px={{xs: 1, md:10}} sx={{display: "flex", justifyContent: 'center', alignItems: "center",}}>

    
      
      {cart.length > 0 ? (
        <Box sx={{ width: 500, padding: 2,   }}>
        <Typography  style={{textAlign: 'center', fontWeight:"bold", fontSize:20}}>
          Your Shopping Carts
        </Typography>
        <Divider />
        <List>
        {cart.map((item, index) => (
            <React.Fragment key={item.id}>
<ListItem key={item.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 2 }}>
  
  {/* Product Information Row */}
  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
    <Box component="img" src={item.image} alt={item.title} sx={{ width: 60, height: 60, marginRight: 2 }} />
    <ListItemText
      primary={item.title}
      
      secondary={
        <>
          <Typography variant="body2">Size: {item.size}</Typography>
          <Typography variant="body2">Color: {item.color}</Typography>
          <Typography variant="body2">Qty: {item.quantity}</Typography>
          <Typography variant="body2">Price: {item.price * item.quantity}</Typography>
        </>
      }
     
    

      sx={{ flex: 1 }}
    />
    <Box  sx={{ flex: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={() => handleQuantityUpdate(item.id, "decrement")}>
        <RemoveIcon />
      </IconButton>
      <Typography>{item.quantity}</Typography>
      <IconButton onClick={() => handleQuantityUpdate(item.id, "increment")}>
        <AddIcon />
      </IconButton>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* <IconButton onClick={() => handleEditClick(item)}>
        <EditIcon />
      </IconButton> */}
      <IconButton onClick={() => handleRemoveFromCart(item.id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </Box>
    </Box>
    

  </Box>
  <Divider sx={{ borderBottomWidth: 3, backgroundColor: 'red' }} />
   {/* Add a Divider only if it's not the last item */}
 
   
        
            

</ListItem>

</React.Fragment>
))}

        </List>
       
        <Button variant="contained"
        sx={{background: 'black', color: 'white',
          '&:hover': {
            background: 'black'
          }
        }}
        fullWidth onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </Box>
       
      ) : (
        <Typography style={{ color: 'red', fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>
          No cart found.
        </Typography>
      )}

     
    </Box>
    <Footer/>
    </React.Fragment>
  );
};

export default CartPage;
