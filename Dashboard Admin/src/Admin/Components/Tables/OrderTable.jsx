import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, Button, Divider, CircularProgress } from '@mui/material';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:6464/order/getAll');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
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

      {loading ? (
        <CircularProgress />
      ) : (
        <React.Fragment>
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
              <Box key={order._id} sx={{ width: '100%', maxWidth: 500, marginBottom: 4, border: '1px solid black', borderRadius: 10, padding: 1 }}>
                <Card
                  sx={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '15px',
                    padding: 2,
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent>
                    {order._id && (
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A403A' }}>
                        Order ID: {order._id}
                      </Typography>
                    )}
                    {order.createdAt && (
                      <Typography variant="body2" color="textSecondary">
                        Order Date: {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                    )}
                    {order.updatedAt && (
                      <Typography variant="body2" color="textSecondary">
                        Last Updated: {new Date(order.updatedAt).toLocaleString()}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {order.shippingContact && (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4A403A' }}>
                          Shipping Contact
                        </Typography>
                        <Typography variant="body2">Email: {order.shippingContact.email}</Typography>
                        <Typography variant="body2">Phone: {order.shippingContact.phone}</Typography>
                      </>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {order.shippingAddress && (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4A403A' }}>
                          Shipping Address
                        </Typography>
                        <Typography variant="body2">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </Typography>
                        <Typography variant="body2">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </Typography>
                      </>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {order.paymentType && (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4A403A' }}>
                          Payment Type
                        </Typography>
                        <Typography variant="body2">{order.paymentType}</Typography>
                      </>
                    )}

                    {order.paymentReceipt && (
                      <Button
                        variant="contained"
                        color="primary"
                        href={order.paymentReceipt}
                        target="_blank"
                        sx={{ mt: 1 }}
                      >
                        View Payment Receipt
                      </Button>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {order.products && order.products.length > 0 ? (
                      <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4A403A' }}>
                          Products
                        </Typography>
                        <Grid container spacing={2}>
                          {order.products.map((product) => (
                            <Grid item key={product._id} xs={12}>
                              <Card
                                sx={{
                                  background: 'linear-gradient(45deg, #4A403A 30%, #FF8E53 90%)',
                                  borderRadius: '10px',
                                  padding: 1,
                                }}
                              >
                                <CardContent>
                                  <Typography variant="h6" sx={{ color: 'white' }}>
                                    {product.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'white' }}>
                                    Size: {product.size} | Color: {product.color} | Quantity: {product.quantity} | Price: ${product.price}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        No products in this order.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </React.Fragment>
      )}
    </Box>
  );
};

export default OrderTable;
