


import React, { useEffect, useState } from "react";
import { Box, Stepper, Step, StepLabel, Typography, Grid, Divider, List, ListItem, ListItemText, IconButton, Button } from "@mui/material";
import InformationForm from "./components/InformationForm";
import ShippingForm from "./components/ShippingForm";
import PaymentForm from "./components/PaymentForm";
import "./Checkout.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";


const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const steps = ["Information", "Shipping", "Payment"];
  const [cart, setCart] = useState([]);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <InformationForm onNext={handleNext} setOrderId={setOrderId} setUserEmail={setUserEmail}/>;
      case 1:
        return <ShippingForm onNext={handleNext} onBack={handleBack} orderId={orderId} />;
      case 2:
        return <PaymentForm onBack={handleBack} orderId={orderId} userEmail={userEmail}/>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top of the page when the component renders
  }, []);
  return (
    <>
    <Navbar/>
    <Box sx={{ width: '100%', mt: 8, padding: { xs: '0px', sm: '0 20px' } , mb: 10 }}>
      <Grid container spacing={2}>
        {/* Stepper and Form Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 2, padding: '0px 20px' }}>
              {renderStepContent(activeStep)}
            </Box>
          </Box>
        </Grid>

        {/* Cart Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ width: '100%', padding: 2, border: '1px solid #ddd', borderRadius: '8px'}}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>  
              Your Shopping Carts
            </Typography>
            <Divider />
            <List>
              {cart.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 0 }}>
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
                     
                      
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Footer/>
    </>
    
  );
};

export default Checkout;

