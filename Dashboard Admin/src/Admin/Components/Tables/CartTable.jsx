import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, Typography, TableHead, TableRow, Button, IconButton, Box, Modal, TextField } from '@mui/material';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartTable = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(1);
  const [updatedColor, setUpdatedColor] = useState('');
  let authToken = localStorage.getItem("Authorization")

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:6464/cart/get', 
        {
            headers: {
              Authorization: `Bearer ${authToken}`, // Add token in headers
            },
        }
      );
      setCartItems(response.data.data.lineItems);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCartItems([]); // Set empty array if 404 is received
      } else {
        console.error('Error fetching cart items:', error);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle removing an item
 




  return (
    <React.Fragment>
   
    <Box py={4} px={{xs: 1, md:10}}>

     
      
      {cartItems.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <img src={item.image} alt={item.productName} width="50" height="50" />
                    <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                    <div style={{ color: 'grey' }}>Size: {item.size}</div>
                    <div style={{ color: 'grey' }}>Color: {item.color}</div>
                  </TableCell>
                  <TableCell>${item.unitAmount.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${(item.unitAmount * item.quantity).toFixed(2)}</TableCell>
                 
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography style={{ color: 'red', fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>
          No cart found.
        </Typography>
      )}

     

      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box p={3} bgcolor="white" borderRadius={2} style={{ maxWidth: '400px', margin: 'auto', marginTop: '10%' }}>
          <h2>Edit Item</h2>
          <TextField
            label="Quantity"
            type="number"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Color"
            value={updatedColor}
            onChange={(e) => setUpdatedColor(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
         
        </Box>
      </Modal>
    </Box>
    </React.Fragment>
  );
};

export default CartTable;
