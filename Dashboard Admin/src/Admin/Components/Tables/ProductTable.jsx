

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
  Modal,
  TextField,
  Box,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { MdModeEditOutline } from 'react-icons/md';
import { CgSearch } from 'react-icons/cg';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Responsive width
  maxWidth: 600, // Max width for larger screens
  height: 'auto', // Auto height for responsive content
  maxHeight: '80vh', // Set max height to ensure it's not too large on mobile
  overflowY: 'auto', // Enables vertical auto-scrolling
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const availableColors = [
    "red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "gray", "black", "white", "cyan", "magenta", 
    "lime", "olive", "navy", "teal", "maroon", "aqua", "fuchsia", "silver", "gold", "coral", "salmon", "khaki", 
    "plum", "violet", "indigo", "lavender", "chocolate", "beige", "tan", "peach", "mint", "charcoal", "emerald", 
    "ruby", "sapphire", "amber", "amber", "periwinkle", "raspberry", "copper", "cobalt", "crimson", "ivory", 
    "lavender", "mauve", "burgundy", "rose", "apricot", "chartreuse", "seashell", "slate", "lavenderblush", 
    "lightcoral", "mediumvioletred", "mediumseagreen", "mediumslateblue", "mediumturquoise", "darkslategray", 
    "lightgray", "lightpink", "lightsalmon", "lightyellow", "darkgoldenrod", "darkorange", "darksalmon", 
    "darkviolet", "darkgreen", "darkkhaki", "darkmagenta", "darkcyan", "darkblue", "cornflowerblue", "lightblue"
];
const availableSizes = ["S", "M", "L", "XL"];

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    discountPrice: '',
    imageFile: null,
    category: '',
    collection: '',
    description: '',
    color: [],
    size: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCollections();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:6464/product/getAll');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get('http://localhost:6464/collection/getall');
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:6464/category/get-categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setNewProduct({
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        imageFile: null,
        category: product.category,
        collection: product.collection,
        description: product.description,
        color: product.color || [],
        size: product.size || [],
      });
      setEditingId(product._id);
      setEditMode(true);
    } else {
      setNewProduct({
        title: '',
        price: '',
        discountPrice: '',
        imageFile: null,
        category: '',
        collection: '',
        description: '',
        color: [],
        size: [],
      });
      setEditMode(false);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleColorChange = (event) => {
    const { value } = event.target;
    setNewProduct({
      ...newProduct,
      color: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSizeChange = (event) => {
    const { value } = event.target;
    setNewProduct({
      ...newProduct,
      size: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmitProduct = async () => {
    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('price', newProduct.price);
    formData.append('discountPrice', newProduct.discountPrice);
    formData.append('image', newProduct.imageFile);
    formData.append('category', newProduct.category);
    formData.append('collection', newProduct.collection);
    formData.append('description', newProduct.description);
    formData.append('color', JSON.stringify(newProduct.color));
    formData.append('size', JSON.stringify(newProduct.size));

    try {
      if (editMode) {
        await axios.put(`http://localhost:6464/product/update?id=${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:6464/product/create-product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
     await fetchProducts();
     await setSearchQuery("");
      await handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ marginTop: 5 }}>
      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <InputBase
          sx={{ ml: 1, flex: 1, border: '1px solid grey', padding: '5px 10px', borderRadius: 0 }}
          placeholder="Search Products"
          inputProps={{ 'aria-label': 'search products' }}
          value={searchQuery}
          onChange={handleSearch}
        />
        <IconButton type="button" aria-label="search">
          <CgSearch />
        </IconButton>
      </Box>

      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        Create Product
      </Button>

      <Paper style={{ marginTop: 20, overflow: "auto" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ position: 'sticky', top: 0 }}>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 100, color: "#1976d2", fontWeight: 'bold' }}>Title</TableCell>
                <TableCell align="center" style={{ minWidth: 100, color: "#1976d2", fontWeight: 'bold' }}>Price</TableCell>
                <TableCell align="center" style={{ minWidth: 100, color: "#1976d2", fontWeight: 'bold' }}>Discount Price</TableCell>
                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Collection</TableCell>
                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Image</TableCell>
                {/* <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Products Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell align="center">{product.title}</TableCell>
                    <TableCell align="center">{product.price}</TableCell>
                    <TableCell align="center">{product.discountPrice}</TableCell>
                    <TableCell align="center">{product.category}</TableCell>
                    <TableCell align="center">{product.collection}</TableCell>
                    <TableCell align="center">
                      <img src={product.image} alt={product.title} width="50" />
                    </TableCell>
                    {/* <TableCell align="center">
                      <IconButton onClick={() => handleOpenModal(product)}>
                        <MdModeEditOutline />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h2>{editMode ? "Update Product" : "Create New Product"}</h2>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={newProduct.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            value={newProduct.price}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Discount Price"
            name="discountPrice"
            fullWidth
            value={newProduct.discountPrice}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Collection</InputLabel>
            <Select
              name="collection"
              value={newProduct.collection}
              onChange={handleInputChange}
            >
              {collections.map((collection) => (
                <MenuItem key={collection.id} value={collection.name}>{collection.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={newProduct.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select
              multiple
              value={newProduct.color}
              onChange={handleColorChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableColors.map((color) => (
               
                <MenuItem key={color} value={color}>
                  <Checkbox checked={newProduct.color.indexOf(color) > -1} />
                  <ListItemText primary={color} /> 
                   <div style={{backgroundColor: color, width: 30, height: 30, borderRadius: 30}}>

                 </div>
                </MenuItem>
               
                 
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Size</InputLabel>
            <Select
              multiple
              value={newProduct.size}
              onChange={handleSizeChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox checked={newProduct.size.indexOf(size) > -1} />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
            />
          </Button> */}
            <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                imageFile: e.target.files[0],
              })
            }
          />
         <Button variant="contained" color="primary" onClick={handleSubmitProduct}>
            {editMode ? "Update Product" : "Create Product"}
          </Button>
        </Box>
       
      </Modal>
    </Container>
  );
};

export default ProductTable;
