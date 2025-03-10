

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const InformationForm = ({ onNext, setOrderId , setUserEmail}) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", phone: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validatePhone = (phone) => phone.trim() !== "";


  const handleContinueToShipping = async () => {
    const newErrors = {
      email: validateEmail(email) ? "" : "Please enter a valid email address",
      phone: validatePhone(phone) ? "" : "Phone number should be 10 digits",
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.phone) {
      try {
        const response = await axios.post("http://localhost:6464/order/create-order", {
          shippingContact: { email, phone }
        });
    
        setOrderId(response.data.order._id);
        setUserEmail(email);
        onNext();
      } catch (error) {
        console.error("Error creating order:", error);
      }
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Phone"
        fullWidth
        margin="normal"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <Button
        sx={{
          marginTop: 10,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        }}
        variant="contained"
        color="primary"
        onClick={handleContinueToShipping}
        fullWidth
      >
        Continue to Shipping
      </Button>
    </Box>
  );
};

export default InformationForm;


