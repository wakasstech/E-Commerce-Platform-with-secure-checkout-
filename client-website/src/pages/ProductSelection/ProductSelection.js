

import React, { useEffect, useState } from 'react';
import { Grid, Typography, Dialog, DialogTitle, DialogContent , Select, 
  MenuItem, DialogActions, Button, Box, useMediaQuery, useTheme, IconButton, Card, CardMedia, CardContent, Drawer, List, ListItem, ListItemText, Divider, ButtonGroup
 } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import addToCartSideImage from "../../assests/images/Add-to-cart-image.png";
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon  from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';


import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Close, NavigateBefore, NavigateNext, RemoveRedEyeOutlined } from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import clothes from "../../assests/images/cloths.png";
import Slider from 'react-slick';

import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';


  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 images on desktop
    slidesToScroll: 1,
    nextArrow: <NavigateNext sx={{color: '#ffff', background:'#4A403A', borderRadius: 10,
      '&:hover': {
        color: '#ffff', background:'#4A403A', borderRadius: 10,
      }
    }}/>,
    prevArrow: <NavigateBefore sx={{color: '#ffff', background:'#4A403A', borderRadius: 10,
      '&:hover': {
        color: '#ffff', background:'#4A403A', borderRadius: 10,
      }
    }}/>,
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
  

const ProductSection = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const { _id,   } = location.state || {};
  const [product, setProduct] = useState(null);
  const availableSizes = product?.size || [];
  const sizesToCheck = ["S", "M", "L", "XL"]; // Predefined sizes to check availability

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  // State management
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const basePrice = product?.price; // Base price of the product
  const [totalPrice, setTotalPrice] = useState(null); // Initialize as null or 0

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price); // Set totalPrice to base price when product is available
    }
  }, [product]);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // Track which item is being edited
  const [editModalOpen, setEditModalOpen] = useState(false); // Control modal visibility

  const [products, setProducts] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Fetch product data by ID
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:6464/product/getbyid?id=${_id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false)
      }
    };

    if (_id) fetchProduct();
  }, [_id]);
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component renders
  }, [product?.title]);
  // Handle size selection
  const handleSizeSelect = (size) => {
    if (!availableSizes.includes(size)) {
      Swal.fire({
        title: 'Not Available',
        text: `This item is not available in size ${size}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      setSelectedSize(size); // Update selected size if available
    }
  };
  const fetchProducts = async () => {
    setLoading(true)
    try {
        const response = await axios.get('http://localhost:6464/product/topProduct');
        setProducts(response.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
      setLoading(false)
    }
};
  useEffect(() => {

    fetchProducts();


  }, []);

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle quantity change
  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) => {
      const newQuantity = operation === 'increment' ? prevQuantity + 1 : prevQuantity > 1 ? prevQuantity - 1 : 1;
      setTotalPrice(newQuantity * basePrice); // Update the total price based on the new quantity
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    const productDetails = {
      id: _id,
  title: product?.title,
  size: selectedSize,
  color: selectedColor,
  quantity,
  price: product?.price,
  image: product?.image,
  totalPrice: product?.price * quantity,
    };

    const existingProductIndex = cart.findIndex(
      (item) =>
        item.id === productDetails.id &&
        item.size === productDetails.size &&
        item.color === productDetails.color
    );

    let updatedCart;
    if (existingProductIndex !== -1) {
      // Update existing product quantity
      updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + productDetails.quantity, totalPrice: (item.quantity + productDetails.quantity) * item.price }
          : item
      );
    } else {
      // Add new product
      updatedCart = [...cart, productDetails];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to local storage
    setCart(updatedCart);
    setDrawerOpen(true); // Open drawer after adding
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleQuantityUpdate = (id, operation) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = operation === "increment" ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Open edit modal with selected item data
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleUpdateItem = () => {
    const updatedCart = cart.map((item) =>
      item.id === editItem.id
        ? { ...item, size: editItem.size, color: editItem.color }
        : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setEditModalOpen(false);
  };

  const handleClickTopPicksCards = (event, product) => {
    event.preventDefault();
    console.log(product)
    const _id = product?._id;     //for product id
    const title = product?.title; //for title 
    const price = product?.price; //for price
    const image = product?.image; // for image
    navigate("/productSection", { state: {_id, title, price, image} } );

  };



  return (

    <React.Fragment>
        <Navbar/>
        {loading? 
          <LoadingScreen/> : 
          (
            <React.Fragment>
               <Box py={{ xs: 4, md: 7 }}>

{loading? 
<LoadingScreen/> : 
(
  <React.Fragment>
    
  </React.Fragment>
)}
<Grid container spacing={2} alignItems="center" justifyContent="center">
{/* Image Section */}
<Grid item xs={12} md={6} display="flex" justifyContent="center">
<Box component="img" src={product?.image} alt="Product Image" sx={{ width: { xs: '100%', md: '550px' }, height: { xs: 'auto', md: '580px' }, borderRadius: 0 }} />
</Grid>

{/* Product Details Section */}
<Grid item xs={12} md={6}>
<Typography sx={{ fontFamily: 'Frank Ruhl Libre', fontSize: { xs: 24, md: 35 }, fontWeight: 900, color: '#4A403A', letterSpacing: '2%' }}>
  {product?.title}
</Typography>
<Typography sx={{ fontFamily: 'Lato', fontSize: { xs: 24, md: 35 }, fontWeight: 600, color: '#4A403A', letterSpacing: '2%' }}>
  PKR {totalPrice?.toFixed(2)}
</Typography>

{/* Size Selector */}
<Box sx={{ marginY: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: 'Lato',
          fontSize: { xs: 24, md: 35 },
          fontWeight: 500,
          color: '#4A403A'
        }}
      >
        Size: {selectedSize || "Select a size"}
      </Typography>
      {/* <ButtonGroup variant="outlined" sx={{ marginTop: 1 }}>
        {sizesToCheck.map((sz) => (
          <Button
            key={sz}
            variant={selectedSize === sz ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: selectedSize === sz ? '#4A403A' : '#EEECEC',
              border: '2px solid #4A403A',
              fontSize: 20,
              color: selectedSize === sz ? '#fff' : '#4A403A',
              '&:hover': {
                backgroundColor: selectedSize === sz ? '#4A403A' : '#EEECEC'
              }
            }}
            onClick={() => handleSizeSelect(sz)}
          >
            {sz}
          </Button>
        ))}
      </ButtonGroup> */}
        <ButtonGroup variant="outlined" sx={{ marginTop: 1 }}>
      {sizesToCheck.map((sz) => {
    const isUnavailable = !availableSizes.includes(sz);

    return (
          <Button
          
            key={sz}
            variant={selectedSize === sz ? 'contained' : 'outlined'}
            sx={{
              backgroundColor: isUnavailable ? '#FFFFFF' : selectedSize === sz ? '#4A403A' : '#EEECEC', // White background if unavailable
              border: '2px solid #4A403A',
              fontSize: 20,
              color: isUnavailable ? '#4A403A' : selectedSize === sz ? '#fff' : '#4A403A',
              '&:hover': {
                backgroundColor: isUnavailable ? '#FFFFFF' : selectedSize === sz ? '#4A403A' : '#EEECEC'
              }
            }}
            onClick={() => handleSizeSelect(sz)}
          >
            {sz}
            {isUnavailable && (
          // <div
          //   style={{
          //     position: 'absolute',
          //     top: 0,
          //     left: 0,
          //     width: '100%',
          //     height: '100%',
          //     // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
          //     color: 'grey',
          //     display: 'flex',
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //     fontSize: '1.5em',
          //     fontWeight: 'bold'
          //   }}
          // >
          //   ⨯
          // </div>
        
            <Close
              sx={{
                fontSize: 16,
                color: 'grey',
                position: 'absolute',
                top: '10%',
                right: '8%'
              }}
            />
         
        )}
          </Button>
        )})}
      </ButtonGroup>
    </Box>

{/* Color Selector */}
<Box sx={{ marginY: 3 }}>
  <Typography variant="subtitle1" sx={{ fontFamily: 'Lato', fontSize: { xs: 20, md: 30 }, fontWeight: 500, color: '#4A403A', textTransform: 'capitalize' }}>
    Color: {selectedColor}
  </Typography>
  <Box sx={{ display: 'flex', gap: 2, marginTop: 2.5 }}>
    {product?.color.map((clr) => (
      <Box key={clr} onClick={() => handleColorSelect(clr)} sx={{
        width: selectedColor === clr ? 40 : 30, height: selectedColor === clr ? 40 : 30,
        backgroundColor: clr.toLowerCase(), borderRadius: '50%', cursor: 'pointer'
      }} />
    ))}
  </Box>
</Box>

{/* Quantity Selector */}
<Box display="flex" alignItems={{ xs: "start", md: 'center' }} gap={6} flexDirection={{ md: 'row', xs: 'column' }}>
  <Box sx={{ marginY: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    <ButtonGroup variant="outlined">
      <IconButton onClick={() => handleQuantityChange('decrement')}>
        <RemoveIcon sx={{ fontWeight: 'bold' }} />
      </IconButton>
      <Typography sx={{ padding: '0 16px', fontWeight: 'bold', color: '#4A403A' }}>{quantity}</Typography>
      <IconButton onClick={() => handleQuantityChange('increment')}>
        <AddIcon sx={{ fontWeight: 'bold' }} />
      </IconButton>
    </ButtonGroup>
  </Box>

  {/* Add to Cart Button */}
  <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon />} sx={{
    padding: { xs: '6px 18px', md: '8px 25px' }, background: '#4A403A', color: 'white', fontWeight: 'bold',
    '&:hover': { background: '#4A403A' }
  }} onClick={handleAddToCart}>
    Add to Cart
  </Button>
</Box>
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
  Similar Product you Like
  </Typography>

  <Slider {...settings} style={{ marginTop: '30px' }}>
  { products.length > 0 && products.map((product, index) => (
    <Card key={index} sx={{ margin: '0 10px', padding: '10px',  boxShadow: 'none', cursor: 'pointer' }}
    onClick={(event) => handleClickTopPicksCards(event, product)}>
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
            </React.Fragment>
          )}
       
 {/* Cart Drawer */}
 <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Cart
          </Typography>
          <Divider />
          <List>
          {cart.map((item, index) => (
              <React.Fragment key={item.id}>
  <ListItem key={item.id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 2 }}>
    
    {/* Product Information Row */}
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
      <Box  sx={{ flex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => handleQuantityUpdate(item.id, "decrement")}>
          <RemoveIcon />
        </IconButton>
        <Typography>{item.quantity}</Typography>
        <IconButton onClick={() => handleQuantityUpdate(item.id, "increment")}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* <IconButton onClick={() => handleEditClick(item)}>
          <EditIcon />
        </IconButton> */}
        <IconButton onClick={() => handleRemoveFromCart(item.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
      </Box>
      

    </Box>
    <Divider sx={{ borderBottomWidth: 3, backgroundColor: 'red' }} />
     {/* Add a Divider only if it's not the last item */}
   
     
          
              
  
  </ListItem>

  </React.Fragment>
))}

          </List>
         
          <Button variant="contained"
          sx={{background: 'black', color: 'white',
            '&:hover': {
              background: 'black'
            }
          }}
          fullWidth onClick={() => navigate("/checkout")}>
            Checkout
          </Button>
        </Box>
      </Drawer>


       {/* Edit Modal */}
       <Dialog
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  fullWidth // This makes the dialog take up the full width of its container
  maxWidth="sm" // Change this to "md" or "lg" for larger sizes
  sx={{ '& .MuiDialog-paper': { width: '300px' } }} // Custom width
>        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Typography>Size:</Typography>
          <Select value={editItem?.size || ""}   sx={{ width: '100%' }} // This will make the select input 100% wide
  onChange={(e) => setEditItem({ ...editItem, size: e.target.value })}>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
            <MenuItem value="XL">XL</MenuItem>
          </Select>
          <Typography>Color:</Typography>
          <Select    sx={{ width: '100%' }} // This will make the select input 100% wide
 value={editItem?.color || ""} onChange={(e) => setEditItem({ ...editItem, color: e.target.value })}>
            <MenuItem value="Red">Red</MenuItem>
            <MenuItem value="Blue">Blue</MenuItem>
            <MenuItem value="Grey">Grey</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button   sx={{ color: 'black',
            '&:hover': {
              color: 'black'
            }
          }} onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button   sx={{background: 'black', color: 'white',
            '&:hover': {
              background: 'black'
            }
          }} onClick={handleUpdateItem} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
<Footer/>
    </React.Fragment>


  );
};

export default ProductSection;