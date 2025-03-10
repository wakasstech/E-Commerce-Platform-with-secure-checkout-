import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Avatar, Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Tab, Tabs, TextField, Typography } from "@mui/material";
import mainsideContentPhoto from "../../assests/images/mainSideContentPhoto.png";
import counterSectionRightImage from "../../assests/images/counter-section-right-image.png";
import mainsideContentLeftDotsPhoto from "../../assests/images/mainSideLeftContentDots.png";
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import clothes from "../../assests/images/cloths.png";
import shoes from "../../assests/images/shoes.jpg";
import accessories from "../../assests/images/accessories.png";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { styled } from '@mui/material/styles';

import './Home.css';
import ProductCard from "../../components/ProductCard/ProductCard";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import Footer from "../../components/Footer/Footer";

import mens1 from "../../assests/images/men1.png"
import mens2 from "../../assests/images/men2.png"
import mens3 from "../../assests/images/men3.png"
import mens4 from "../../assests/images/men4.png";
import womens1 from "../../assests/images/women1.png";
import womens2 from "../../assests/images/women2.png";
import womens3 from "../../assests/images/women3.png";
import womens4 from "../../assests/images/women4.png";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";


const customerReviews = [
  {
    "name": "Ali Khan",
    "comment": "Absolutely love this scarf! It's soft and keeps me warm without being too bulky.",
    "image": "https://st5.depositphotos.com/2398521/64079/i/450/depositphotos_640793526-stock-photo-happy-smiling-man-looking-camera.jpg"
  },
  {
    "name": "Fatima Ahmed",
    "comment": "These sunglasses are stylish and comfortable. Perfect for summer outings!",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvHBVdyswClsm3OmDr2qCjX8SxQKhg09_xWA&s"
  },
  {
    "name": "Bilal Malik",
    "comment": "The quality of this belt is outstanding. It feels durable and looks great with any outfit.",
    "image": "https://media.istockphoto.com/id/924011714/photo/portrait-of-indian-man.jpg?s=612x612&w=0&k=20&c=hwPqL9zTBAF7CwJ-TGkZ1DamzBxLyZ6ARXcKqp1d7Ro="
  },
  {
    "name": "Ayesha Shah",
    "comment": "I bought this handbag for a wedding, and I received so many compliments! Highly recommend.",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtfqZXXq8LsMyJCJuIixd5Rac2y8-7p_n-g&s"
  },
  {
    "name": "Omer Butt",
    "comment": "These gloves fit perfectly and keep my hands warm during the cold months. Great purchase!",
    "image": "https://i.pinimg.com/originals/7b/14/e8/7b14e88bc4a98cd646a0ea58a4fe984c.jpg"
  },
  {
    "name": "Sara Hussain",
    "comment": "This watch is elegant and goes with everything. I wear it daily!",
    "image": "https://media.licdn.com/dms/image/C4E22AQHNIyaCM6Ic8g/feedshare-shrink_800/0/1639294630694?e=2147483647&v=beta&t=ngpoADg015b5P1DnMuH76tqE82t49kBkbh2xECrFQ9w"
  }
];

const settings= {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3, // Show 3 images on desktop
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3, // 3 slides on medium screens
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2, // 2 slides on tablet
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1, // 1 slide on mobile
        slidesToScroll: 1,
      },
    },
  ],
};

const settingsCustomReviewSlider  = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3, // Show 3 images on desktop
  slidesToScroll: 1,
  nextArrow: <NavigateNext sx={{color: '#ffff', background:'#4A403A',  borderRadius: 10,
    '&:hover': {
      color: '#ffff', background:'#4A403A',  borderRadius: 10,
    }
  }}/>,
  // prevArrow: <NavigateBefore sx={{color: '#4A403A'}} />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3, // 3 slides on medium screens
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2, // 2 slides on tablet
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1, // 1 slide on mobile
        slidesToScroll: 1,
      },
    },
  ],
};



// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   color: '#4A403A',
//   fontWeight: 'bold',
//   // Making tabs scrollable on small screens
//   [theme.breakpoints.down('sm')]: {
//     minHeight: '48px', // Adjust the height of the tabs
//     '& .MuiTabs-flexContainer': {
//       flexWrap: 'nowrap', // Prevent wrapping of tabs
//       overflowX: 'auto',  // Allow horizontal scrolling
//     },
//     '& .MuiTab-root': {
//       minWidth: 'auto',  // Override default min-width
//       padding: theme.spacing(1),
//       fontSize: '0.8rem', // Reduce font size for small screens
//     },
//   },
// }));
// Helper function to calculate time left
const calculateTimeLeft = (startDate) => {
  const difference = startDate + 3 * 24 * 60 * 60 * 1000 - new Date().getTime();
  return {
    days: Math.max(Math.floor(difference / (1000 * 60 * 60 * 24)), 0),
    hours: Math.max(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
    minutes: Math.max(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)), 0),
  };
};


// const productData = [
//   // Add your product data here
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: mens1, category: 'hot' },
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: womens1 , category: 'hot'},
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: mens2, category: 'hot' },
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: womens2, category: 'hot' },
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: mens3 , category: 'hot'},
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: womens3, category: 'hot' },
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: mens4 , category: 'hot'},
//   { title: 'Pastel Long Sleeves', price: 220, discountPrice: 140, image: womens4 , category: 'hot'},
//   // Add more products
// ];

const Home = () => {
   const navigate = useNavigate();
   const token = useSelector((state) => state.auth.token);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  //collections
  const [collections, setCollections] = useState([]);
  const [productData, setProdutData] = useState([]);

 // Handle tab change
 const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};




// const creationTime = userCreationDate; // Example creation time (UTC)

// const startDate =  new Date(creationTime).getTime(); // User creation time
// const endTime =  new Date(startDate + 3 * 24 * 60 * 60 * 1000); // 3 days later





 // Filter data based on active tab
 const filteredData = productData.filter((product) => {
  switch (activeTab) {
    case 0:
      return product; // Replace 'hot' with your actual category data
    case 1:
      // return product.category === 'Men';
      return product; 
    case 2:
      // return product.category === 'Women';
      return product; 
    case 3:
      return product;
    default:
      return product;
  }
});

  // const collections = [
  //   {
  //     title: 'CLOTHES',
  //     image: clothes,
  //   },
  //   {
  //     title: 'SHOES',
  //     image: shoes,
  //   },
  //   {
  //     title: 'ACCESSORIES',
  //     image: accessories,
  //   },
  // ];




  const fetchProducts = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:6464/product/topProduct');
        setProdutData(response.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
      setLoading(false)
    }
};
  
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

  useEffect(() => {
    fetchCollections();
    fetchProducts();

  }, []);


       

 

  // if (!startDate || !endTime) {
  //   return null; // Or some loading indicator
  // }
  const handleClickTopPicksCards = (event, product) => {
    event.preventDefault();
    const _id = product?._id;     //for product id
    const title = product?.title; //for title 
    const price = product?.price; //for price
    const image = product?.image; // for image
    navigate("/productSection", { state: {_id, title, price, image} } );

  };

  const handleClickShop = () => {
    navigate('/collections');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <React.Fragment>
      <Navbar />

      {loading ? 
      <LoadingScreen/> : 
      (
        <React.Fragment>
             <Grid container spacing={3} py={5} px={{ xs: 3, md: 7 }} sx={{ background: "#F6E1C3", minHeight: "100vh" }}>
        
        {/* Left Content */}
        <Grid item xs={12} md={6} >
          <Box position="relative">
            <Box display={{ xs: 'none', md: 'block' }}>
            <img
              src={mainsideContentLeftDotsPhoto}
              style={{
                width: '130px',
                height: '90px',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              alt={'shop-it'}
            />
            </Box>
           
            <Box px={{ xs: 4, md: 5, }} pt={{ xs: 0, md: 15 }} >
              <Typography
                sx={{
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 40, md: 68 },
                  fontWeight: 900,
                  lineHeight: { xs: '50px', md: '87.79px' },
                  color: '#4A403A',
                  letterSpacing: '2%',
                }}
              >
                Your Signature Style, Perfectly Tailored
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 400,
                  lineHeight: '30px',
                  color: '#4A403A',
                  letterSpacing: '2%',
                  marginTop: { xs: 2, md: 5 },
                }}
              >
                Curated collections that blend tradition with contemporary flair.
              </Typography>
              <Button onClick={handleClickShop}
                sx={{
                  padding: { xs: '12px 40px', md: '24px 65px' },
                  borderRadius: 0,
                  background: '#4A403A',
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: { xs: 2, md: 3 },
                  '&:hover':{
                    background: '#4A403A',
                    color: 'white',
                   
                  }
                }}
              >
                SHOP NOW
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              maxWidth: { xs: '100%', md: '650px' },
              maxHeight: { xs: 'auto', md: '800px' },
            }}
          >
            <img
              src={mainsideContentPhoto}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt="shop-it"
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: { xs: '-20px', md: '-30px' },
                right: { xs: '10px', md: '48px' },
                padding: { xs: 1, md: 2 },
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ChatIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>


      <div style={{ padding: '50px 0', textAlign: 'center' }}>
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
      <Grid container spacing={0}  sx={{ marginTop: 8, px:   { xs: 0, md: 20 }, }}>
        {collections.map((collection, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box display="flex" justifyContent="center" >
            <Card sx={{ position: 'relative',  maxWidth: 280, mb: { xs: 2, md: 4  }, borderRadius: 0 , transition: "transform 0.3s, box-shadow 0.3s",
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
    </div> 

    <Box  sx={{ backgroundColor: '#4f4a47', padding: {xs: '50px 40px', md: '50px 50px' }}}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'white', padding: '0 20px' }}>
            <Typography variant="h4" gutterBottom
             sx={{
              fontFamily: 'Frank Ruhl Libre',
              fontSize: { xs: 35, md: 60 },
              fontWeight: 900,
              lineHeight: { xs: '30px', md: '60px' },
              color: '#FFFFFF',
              letterSpacing: '2%',
            }}
            >
              Our Most Loved Picks
            </Typography>
            <Typography  gutterBottom
             sx={{
              
        fontSize: { xs: 14, md: 20 },
        fontWeight: 400,
        lineHeight: { xs: '18px', md: '26px' },
        px: {xs: 2.5, md: 0},
        color: '#FFFF',
        letterSpacing: '2%',
            }}
            >
              Discover The Top-Selling Favorites Customers Can’t Get Enough Of.
            </Typography>
            <Button variant="outlined" color="inherit" sx={{ mt: 3.5, px:3.5, py:1, borderRadius: 0 }}>
              SEE MORE
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} >
          <Slider {...settings} style={{ marginTop: '30px' }}>
            {productData.length > 0 && productData.slice(0, 4).map((product, index) => (
              <Card key={index} sx={{ margin: '0 10px', padding: '10px', cursor: 'pointer', background: '#4f4a47', boxShadow: 'none',   }}
              onClick={(event) => handleClickTopPicksCards(event, product)}

              >
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.title}
                />
                <CardContent sx={{background: '#D9D9D9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1, color: 'orangered' }}>
                    {'★'.repeat(Math.floor(product.rating))}
                    {product.rating % 1 !== 0 && '½'}
                  </Box>
                  <Typography variant="h6" color="#4A403A">{product.title}</Typography>
                  <Typography variant="body2" color="#4A403A" >
                    {product.originalPrice} <span style={{ textDecoration: 'line-through' }}>{product.discountedPrice}</span>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Box>


    <Box  sx={{  flexGrow: 1,  background: '#F6E1C3',  padding:{xs: 6, md: 10}}}>
    <Typography variant="h4" gutterBottom align="center" 
     sx={{
      fontFamily: 'Frank Ruhl Libre',
      fontSize: { xs: 35, md: 60 },
      fontWeight: 900,
      lineHeight: { xs: '30px', md: '60px' },
      color: '#4A403A',
      letterSpacing: '2%',
    }}>
      Our Products
    </Typography>
    <Tabs  centered
        value={activeTab}
        onChange={handleTabChange}
        
        // variant="scrollable"
        // scrollButtons="auto"
        sx={{
          marginBottom: 2,
          color: '#4A403A',
          fontWeight: 'bold',
          minHeight: { xs: '40px' },
          '& .MuiTabs-flexContainer': {
            flexWrap: 'nowrap',
            overflowX: 'auto',
          },
          '& .MuiTab-root': {
            minWidth: { xs: 'auto' },
            padding: { xs: 1 , md: 1.5},
            fontSize: { xs: '0.5rem', md:'0.8rem' },
            color: 'black'
          },
          '& .MuiTab-root.Mui-selected': {
          
            color: 'black',
            // fontWeight: 'bold'
          },
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: '#B62024', // Change to desired color for underline
            // height: '3px',
          },
        }}
      >
        <Tab label="HOT"  />
        <Tab label="ON SALE" />
        <Tab label="TRENDING NOW"  />
        <Tab label="NEW ARRIVALS" />
      </Tabs>
    <Grid container  spacing={0}>
      {filteredData.map((product, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <ProductCard {...product} />
        </Grid>
      ))}
    </Grid>
  </Box>


  <Box 
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#F6E1C3',
        padding:{xs: 4, md: 10}
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} mt={5}>
        <Typography
                sx={{
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 40, md: 68 },
                  fontWeight: 900,
                  lineHeight: { xs: '50px', md: '87.79px' },
                  color: '#4A403A',
                  letterSpacing: '2%',
                }}
              >
                Today’s Hottest Fashion Deals
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 400,
                  lineHeight: '30px',
                  color: '#4A403A',
                  letterSpacing: '2%',
                  marginTop: { xs: 2, md: 5 },
                }}
              >
               Exclusive Discounts on Top Collections.
              </Typography>

              {/* {endTime &&( */}

                <>

               
                    <CountdownTimer />
                </>
               
            
               {/* )}  */}
         
          <Button mt={5}
            variant="contained"
            onClick={handleClickShop
            }
            // disabled={ endTime < new Date()} // Disable if time is up
            sx={{
              padding: { xs: '12px 40px', md: '24px 65px' },
              borderRadius: 0,
              fontWeight: 'bold',
              marginTop: '20px',
              //  backgroundColor: endTime < new Date() ? '#ccc' : '#4A403A', color: '#fff',
              backgroundColor: '#4A403A',
              '&:hover' :{
                backgroundColor: '#4A403A'
              }
            }}
          
          >
           SHOP NOW
          </Button>


         
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={counterSectionRightImage} // Replace with your image URL
            alt="Fashion Deals"
            style={{ width: '100%',height: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>
    </Box>




    <Box  sx={{  padding: {xs: '50px 40px', md: '50px 60px'}}} >
      <Grid container spacing={2} alignItems="center" justifyContent="center" >
        
        <Grid item xs={12} md={12} >
            <Typography   sx={{
              textAlign: 'center',
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 29, md: 43 },
                  fontWeight: 900,
                  lineHeight: { xs: '50px', md: '87.79px' },
                  color: '#4A403A',
                  letterSpacing: '2%',
                }}>
            Customer Review
            </Typography>

          <Slider className="customer-review-slider" {...settingsCustomReviewSlider} style={{ marginTop: '20px' }}>
            {customerReviews.map((product, index) => (
              <Card key={index} sx={{ margin: '0 10px', padding: '0px 7px', boxShadow: 'none' ,transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                
                }, }}>
                {/* <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.title}
                /> */}

                {/* <Box></Box> */}
               

                <CardContent sx={{background: '#FBF6ED', padding: '40px 0px'}}>

                <Typography
                sx={{
                  fontFamily: 'Frank Ruhl Libre',
                  fontSize: { xs: 14, md: 18 },
                  fontWeight: 500,
                  lineHeight: '30px',
                  color: '#4A403A',
                  letterSpacing: '2%',
                  textAlign: 'start',
                  px: 4
                 
                }}
              >
               {product.comment}
              </Typography>

                <Box display="flex" justifyContent="center" mt={3} mb={2}>
                <Avatar sx={{ height: '70px', width: '70px' }} alt="Remy Sharp" src={product.image} />
                </Box>
              
                
                  <Typography variant="h6" color="#4A403A" textAlign={"center"}>{product.name}</Typography>
                  <Typography variant="body2" color="#4A403A" textAlign={"center"}>
                  Customer
                  </Typography>
                  
                </CardContent>
              </Card>
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Box>

          </React.Fragment>
      )}

   
  
   <Footer/>

    </React.Fragment>
  );
};

export default Home;



