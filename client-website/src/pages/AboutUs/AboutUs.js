import React from 'react';
import { Grid, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import clothingDesign from "../../assests/images/about-us-leftContent.png";
import traditionPic from "../../assests/images/about-us-rightContent.png";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const AboutUs = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
   <React.Fragment>
    <Navbar/>
    <Box sx={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom  sx={{
      fontFamily: 'Frank Ruhl Libre',
      fontSize: { xs: 35, md: 60 },
      fontWeight: 900,
      lineHeight: { xs: '30px', md: '60px' },
      color: '#4A403A',
      letterSpacing: '2%',
    }}>
        About Us
      </Typography>
      
      <Grid container spacing={4} alignItems="center" mt={{xs: 0, md: 2}}>
        {/* Text Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" align={isSmallScreen ? 'center' : 'left'}
          sx={{
            fontFamily: {xs: 'inherit', md:'Frank Ruhl Libre'},
            fontSize: { xs: 12, md: 20 },  // Reduced font size for xs
            fontWeight: 500,
            lineHeight: { xs: '20px', md: '30px' },  // Adjusted line height
            px: { xs: 2, md: 0 },  // Padding for small screens
            color: '#4A403A',
            letterSpacing: '2%',
            textAlign: { xs: 'center', md: 'start' },  // Center text on small screens
          }}>
            Welcome to Arshy Maula, where tradition meets contemporary fashion. We specialize in offering a curated collection of eastern women's tops, blending cultural elegance with modern designs, and trendy men's t-shirts that cater to your everyday style. Our mission is to provide high-quality, comfortable, and stylish clothing that empowers individuals to express their unique fashion. Each piece is crafted with attention to detail and a commitment to excellence. Join us in celebrating style, comfort, and tradition!
          </Typography>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <img
            src={traditionPic}
            alt="Eastern clothing"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} alignItems="center" sx={{ marginTop: '2rem' }}>
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <img
            src={clothingDesign}
            alt="Clothing Design"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>

        {/* Vision Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" align={isSmallScreen ? 'center' : 'left'}
          sx={{
            textAlign: "center",
            fontFamily: 'Frank Ruhl Libre',
            fontSize: { xs: 25, md: 35 },
            fontWeight: 900,
            lineHeight: { xs: '30px', md: '60px' },
            color: '#4A403A',
            letterSpacing: '2%',
          }}>
            Vision
          </Typography>
          <Typography variant="body1" align={isSmallScreen ? 'center' : 'left'}
          sx={{
            fontFamily: {xs: 'inherit', md:'Frank Ruhl Libre'},
            fontSize: { xs: 12, md: 20 },  // Reduced font size for xs
            fontWeight: 500,
            lineHeight: { xs: '20px', md: '30px' },  // Adjusted line height
            px: { xs: 2, md: 0 },  // Padding for small screens
            color: '#4A403A',
            letterSpacing: '2%',
            textAlign: { xs: 'center', md: 'start' },  // Center text on small screens
          }}>
            Our vision is to redefine elegance with simplicity. We aspire to create a fashion line that merges classic eastern designs with modern minimalism, offering clothing that makes you feel effortlessly stylish and comfortable. We believe true elegance lies in understated beauty, and our mission is to provide fashion that empowers individuals to express their uniqueness through timeless yet simple clothing choices, crafted with care and authenticity.
          </Typography>
        </Grid>
      </Grid>
    </Box>
    <Footer/>
    </React.Fragment>
  );
};

export default AboutUs;
