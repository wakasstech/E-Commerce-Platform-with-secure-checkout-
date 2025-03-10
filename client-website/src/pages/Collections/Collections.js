import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Typography, Grid, Box, Card, CardMedia, CardContent, Button } from '@mui/material';
import clothes from "../../assests/images/cloths.png";
import shoes from "../../assests/images/shoes.jpg";
import accessories from "../../assests/images/accessories.png";
import bags from "../../assests/images/bags.png";
import shirts from "../../assests/images/shirts.png";
import outwear from "../../assests/images/out-wear.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';


const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);
  const fetchCollections = async () => {
    setLoading(true);

    try {
        const response = await axios.get('http://localhost:6464/collection/getall');
        setCollections(response.data);
    } catch (error) {
        console.error("Error fetching collections:", error);
      }finally {
        setLoading(false)
      }
  };
  return (
    <React.Fragment>
        <Navbar/>
        <div style={{ padding: '50px 0', textAlign: 'center' }}>

        {loading ? 
      <LoadingScreen/> : 
      (
        <React.Fragment>
        <Typography
  variant="h4"
  gutterBottom
  sx={{
    fontFamily: 'Frank Ruhl Libre',
    fontSize: { xs: 28, md: 60 },  // Slightly smaller for xs
    fontWeight: 900,
    lineHeight: { xs: '36px', md: '77.46px' },  // Adjusted line height for better fit
    color: '#4A403A',
    letterSpacing: '2%',
    textAlign: { xs: 'center', md: 'center' },  // Center text on small screens if needed
    px: { xs: 2, md: 0 },  // Add some padding for small screens
  }}
>
  Explore Collection
</Typography>
<Typography
  variant="subtitle1"
  gutterBottom
  sx={{
    fontFamily: {xs: 'inherit', md:'Frank Ruhl Libre'},
    fontSize: { xs: 12, md: 20 },  // Reduced font size for xs
    fontWeight: 500,
    lineHeight: { xs: '20px', md: '30px' },  // Adjusted line height
    px: { xs: 2, md: 0 },  // Padding for small screens
    color: '#4A403A',
    letterSpacing: '2%',
    textAlign: { xs: 'center', md: 'center' },  // Center text on small screens
  }}
>
  Curate Your Style With Our Newly Launched Exclusive Collections For Women And Men 
</Typography>
      <Grid container spacing={0}  sx={{ marginTop: 8, px:   { xs: 0, md: 20 } }}>
        {collections.map((collection, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box display="flex" justifyContent="center" >
            <Card sx={{ position: 'relative',  maxWidth: 280, mb: { xs: 2, md: 4 }, borderRadius: 0,  transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                              transform: "scale(1.03)",
                             
                            }, }}
                            onClick={() => navigate(`/products?collection=${collection.name}`)}
>
     
              <CardMedia
                component="img"
                height="300"
                
                image={collection.image}
                alt={collection.title}
              />
              <CardContent
                sx={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                }}
              >
                <Button variant="contained" color="primary" sx={{background: '#FFFF', color: '#4A403A', fontWeight: 'bold',  fontSize: 20, 
                   '&:hover': {
                    backgroundColor: '#ffffff',
                    boxShadow: 30,
                  }
                }}>
                  {collection.name}
                </Button>
              </CardContent>
            </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
      </React.Fragment>
      )}
    </div> 



      <Footer/>
    </React.Fragment>
  )
}

export default Collections
