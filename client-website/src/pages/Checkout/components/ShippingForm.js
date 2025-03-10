
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const ShippingForm = ({ onNext, onBack, orderId }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({ firstName: "", city: "", street: "" });

  const validateFirstName = (name) => name.trim() !== "";
  const validateCity = (cityName) => cityName.trim() !== "";
  const validateAddress = (street) => street.trim() !== "";

  const handleContinueToPayment = async () => {
    const newErrors = {
      firstName: validateFirstName(firstName) ? "" : "First name is required",
      city: validateCity(city) ? "" : "City is required",
      street: validateAddress(street) ? "" : "Address is required",
    };

    setErrors(newErrors);

    if (!newErrors.firstName && !newErrors.city && !newErrors.street) {
      try {
        await axios.put("http://localhost:6464/order/update-order", {
          orderId,
          shippingAddress: { firstName, lastName, street, city, postalCode, country }
        });
        onNext();
      } catch (error) {
        console.error("Error updating shipping address:", error);
      }
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <TextField
        label="First Name"
        fullWidth
        margin="normal"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
      <TextField
        label="Last Name"
        fullWidth
        margin="normal"
        
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label="Address"
        fullWidth
        margin="normal"
        required
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        error={!!errors.street}
        helperText={errors.street}
      />
      <TextField
        label="City"
        fullWidth
        margin="normal"
        required
        value={city}
        onChange={(e) => setCity(e.target.value)}
        error={!!errors.city}
        helperText={errors.city}
      />
      <TextField
        label="Postal Code"
        fullWidth
        margin="normal"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />
      <TextField
        label="Country"
        fullWidth
        margin="normal"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onBack}
        sx={{
          mr: 3,
          mb: 7,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        }}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueToPayment}
        sx={{
          mb: 7,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        }}
      >
        Continue to Payment
      </Button>
    </Box>
  );
};

export default ShippingForm;
