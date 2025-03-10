import { Box, Grid, Typography, TextField, Button, IconButton  } from '@mui/material';
import footerLogo from "../../assests/images/footer Logo.png";
import React from 'react';
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    window.open(url, '_blank');
  };
  return (
    <Box
    component="footer"
    sx={{
      backgroundColor: '#4A403A', // Background color matching the image
      color: '#E0D9D1', // Light text color
      padding: {xs: '50px', md :'90px 50px'},
    }}
  >
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4} md={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: {xs: 'center', md:'flex-start'} }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <img src={footerLogo} alt="Logo" style={{ maxWidth: '100px' }} />
          </Typography>
          <Typography variant="body1">SOCIAL MEDIA</Typography>
          <Box 
      sx={{ 
        marginTop: 4,
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        // backgroundColor: '#6C4A33', 
        // padding: '1rem', 
        borderRadius: '8px' 
      }}
    >
      {/* Facebook Icon */}
      <IconButton onClick={() => handleNavigate('https://www.facebook.com')} sx={{ color: 'white' }}>
        <Facebook fontSize="large" />
      </IconButton>

      {/* Instagram Icon */}
      <IconButton onClick={() => handleNavigate('https://www.instagram.com')} sx={{ color: 'white' }}>
        <Instagram fontSize="large" />
      </IconButton>

      {/* WhatsApp Icon */}
      <IconButton onClick={() => handleNavigate('https://web.whatsapp.com')} sx={{ color: 'white' }}>
        <WhatsApp fontSize="large" />
      </IconButton>
    </Box>

        </Box>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Shop
        </Typography>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} 
        onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
       >Products</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>Overview</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>Pricing</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>Releases</Typography>
        </Box>
      
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Company
        </Typography>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/aboutUs");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>About us</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/contactUs");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>Contact</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
          navigate("/aboutUs");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>News</Typography>
        <Typography variant="body2" style={{textDecoration: 'underline', cursor: 'pointer'}}onClick={() => {
          navigate("/contactUs");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>Support</Typography>
       </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={5}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          STAY UP TO DATE
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E9D7B9',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              flexGrow: 1,
              backgroundColor: '#FFF', // Light background for the text input
              
              '& input': {
                padding: '10px 12px',
              },
             
              border: '1px solid #F6E1C3',
              borderRadius: 0
            }}
            InputProps={{ disableUnderline: true }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFF2E5', // Button color matching the image
              color: '#5A4D42', // Text color for the button
              fontWeight: 'bold',
              borderRadius: '0',
              padding: '10px 20px',
              borderRadius: 0,
              '&:hover':{
                backgroundColor: '#FFF2E5', // Button color matching the image
              }
            }}
          >
            SUBMIT
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, marginTop: 8 }}>
        <Typography variant="body2" style={{ cursor: 'pointer', fontWeight: 'bold'}}>Terms</Typography>
        <Typography variant="body2" style={{ cursor: 'pointer', fontWeight: 'bold'}}>Privacy</Typography>
        <Typography variant="body2" style={{cursor: 'pointer', fontWeight: 'bold'}}>Cookies</Typography>
      </Box>
      </Grid>
    </Grid>

    <Box
      sx={{
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderTop: '1px solid #DCDCDC',
        paddingTop: '20px',
        color: '#EFCFA1',
      }}
    >
      
      <Typography variant="body2" >
        @DevRolin2024, All Rights Reserved
      </Typography>
      
     
   
    </Box> 
  </Box>
  )
}

export default Footer
