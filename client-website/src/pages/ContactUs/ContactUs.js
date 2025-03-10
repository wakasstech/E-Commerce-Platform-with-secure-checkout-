import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';
import { Email, Phone } from '@mui/icons-material';
import axios from 'axios'; // You'll need to install axios
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ContactUs = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // State for handling API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error and set loading to true
    setError(null);
    setLoading(true);

    // Form data object to send in API
    const contactData = {
      name,
      email,
      message
    };

    try {
      // Make API request to send contact data
      const response = await axios.post('https://api.example.com/contact', contactData);
      console.log('Contact request sent:', response.data);

      // Reset form after submission
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error sending contact request:', err);
      setError('Failed to send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <React.Fragment>
    <Navbar/>
    <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{
      fontFamily: 'Frank Ruhl Libre',
      fontSize: { xs: 35, md: 60 },
      fontWeight: 900,
      lineHeight: { xs: '30px', md: '60px' },
      color: '#4A403A',
      letterSpacing: '2%',
    }}>
        Contact Us
      </Typography>

      {/* Form Submission */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={3}>
          {/* Name Input */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Enter Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)} // Handle name input change
              required
            />
          </Grid>

          {/* Email Input */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Enter Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Handle email input change
              InputProps={{
                startAdornment: <Email sx={{ marginRight: '8px', color: 'gray' }} />,
              }}
              required
            />
          </Grid>

          {/* Message Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter Message"
              variant="outlined"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Handle message input change
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: '#6C4A33', color: 'white', 
                '&:hover':{
                    backgroundColor: '#6C4A33',
                }
               }}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'SENDING...' : 'SEND'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Display error message if there is an error */}
      {error && (
        <Typography color="error" align="center" sx={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}

      {/* Contact Details */}
      <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
        <Typography variant="body1" sx={{
            textAlign: "center",
            
            fontSize: { xs: 15, md: 18 },
            fontWeight: 900,
            lineHeight: { xs: '20px', md: '35px' },
            color: '#4A403A',
            letterSpacing: '2%',
          }}>
          NEED HELP?
        </Typography>

        <Grid container justifyContent="center" spacing={4} mt={0.5}>
          {/* Phone Contact */}
          <Grid item>
            <Phone sx={{ verticalAlign: 'middle', marginRight: '4px', color: 'grey' }} />
            +971 55 620 3945
          </Grid>

          {/* Email Contact */}
          <Grid item>
            <Email sx={{ verticalAlign: 'middle', marginRight: '4px',color: 'grey' }} />
            Ceo.Kashan@Arshymuala.com
          </Grid>
        </Grid>
      </Box>
    </Box>
    <Footer/>
    </React.Fragment>
  );
};

export default ContactUs;
