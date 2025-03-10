import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Typography, Grid, Box, MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import ProductCard from "../../components/ProductCard/ProductCard";
import clothes from "../../assests/images/cloths.png";
import mens1 from "../../assests/images/men1.png"
import mens2 from "../../assests/images/men2.png"
import mens3 from "../../assests/images/men3.png"
import mens4 from "../../assests/images/men4.png";
import womens1 from "../../assests/images/women1.png";
import womens2 from "../../assests/images/women2.png";
import womens3 from "../../assests/images/women3.png";
import womens4 from "../../assests/images/women4.png";


import coverImage from "../../assests/images/cover-image.png"; // Import your cover image
import allCategory from "../../assests/images/All-Category.png";
import menCategory from "../../assests/images/mensCategory.jpg";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";


const Products = ({ initialCategory }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get 'collection' from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const collection = queryParams.get("collection");

  const [category, setCategory] = useState("all");
  const [productData, setProdutData] = useState([]);
  useEffect(() => {
    setCategory(initialCategory); // Set the initial category based on the prop
  }, [initialCategory]);


  useEffect(() => {
    // Check if the URL has a collection query parameter
  
    if (collection) {
      fetchProductsByCollection(collection);
      setCategory("all"); // Set the initial category

    } else {
      setCategory(initialCategory); // Set the initial category
      fetchProducts(); // Fetch default products
    }
  }, [location.search, initialCategory]);

  // Fetch products by collection
  const fetchProductsByCollection = async (collectionName) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:6464/product/getProductByCollection?collection=${collectionName}`
      );
      setProdutData(response.data);
    } catch (error) {
      console.error("Error fetching products by collection:", error);
    }finally {
      setLoading(false)
    }
  };


const fetchProducts = async () => {
  setLoading(true);

    try {
        const response = await axios.get('http://localhost:6464/product/getAll');
        setProdutData(response.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }finally {
      setLoading(false)
    }
};

  // Filter products based on the selected category
  const filteredProducts = category === "all" 
    ? productData 
    : productData.filter(product => product.category === category);

    const coverImageSelection = category === "Men" 
    ? menCategory 
    : category === "Women" 
    ? coverImage 
    : allCategory

  return (
    <React.Fragment>
      <Navbar />
      {loading ? 
      <LoadingScreen/> : 
      (
        <React.Fragment>
      {/* Cover Image */}
      <Box 
        component="img"
        src={coverImageSelection} 
        alt="Cover Image" 
        sx={{ width: "100%", height: "auto" }} 
      />

      {/* Filter Dropdown */}
    

      {/* Product Grid */}
      <Box sx={{ flexGrow: 1, padding: { xs: 2, md: 6 } }}>
        <Box display={"flex"} justifyContent={{xs: 'center', md: 'flex-end'}} px={{xs: 0, md:5}} >
      <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={category}
            label="Filter"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Men">Men</MenuItem>
            <MenuItem value="Women">Women</MenuItem>
          </Select>
        </FormControl>
        </Box>
        <Grid container spacing={3} mt={2}>
          {filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ProductCard {...product} />
            </Grid>
          ))}
        </Grid>
      </Box>
      </React.Fragment>
      )}
      <Footer />
    </React.Fragment>
  );
};

export default Products;
