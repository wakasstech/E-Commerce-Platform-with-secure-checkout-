import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ShoppingBagOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:6464/order/userOrders', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'white',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Button
            endIcon={<ShoppingBagOutlined />}
            sx={{
              mt: 2,
              fontSize: 16,
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: '#D32F2F',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => navigate('/carts')}
          >
            Add to carts
          </Button>
        </Box>
        <Typography
          variant="h4"
          mt={0}
          gutterBottom
          sx={{
            fontFamily: 'Frank Ruhl Libre',
            fontSize: { xs: 30, md: 50 },
            fontWeight: 900,
            lineHeight: { xs: '30px', md: '60px' },
            color: '#4A403A',
            letterSpacing: '2%',
          }}
        >
          Your Orders
        </Typography>

        {orders.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              color: '#4A403A',
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            No orders found.
          </Typography>
        ) : (
          orders.map((order) => (
            <Box key={order._id} sx={{ width: '100%', maxWidth: 500, marginBottom: 4 }}>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h6" gutterBottom sx={{ color: '#4A403A' }}>
                  Total: PKR{order.totalAmount}
                </Typography>
                <Typography
                  variant="body2"
                  color="#4A403A"
                  gutterBottom
                  fontWeight={'bold'}
                  textTransform={'capitalize'}
                >
                  Payment Status: {order.paymentDetails.paymentStatus}
                </Typography>
              </Box>
              <Grid container spacing={2} direction="column">
                {order.products.map((product) => (
                  <Grid item key={product._id} xs={6} md={6}>
                    <Card
                      sx={{
                        background: 'linear-gradient(45deg, #4A403A 30%, #FF8E53 90%)',
                        borderRadius: '15px',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        padding: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                          Size: {product.size}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                          Color: {product.color}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                          Quantity: {product.quantity}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}
                        >
                          Price: PKR{product.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Box>
      <Footer />
    </>
  );
};

export default OrderPage;
