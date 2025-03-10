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
} from '@mui/material';
import axios from 'axios';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    // Fetch all categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:6464/category/get-categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Handle modal open/close
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        setNewCategory({
            ...newCategory,
            [e.target.name]: e.target.value,
        });
    };

    // Create a new category
    const handleCreateCategory = async () => {
        try {
            const response = await axios.post('http://localhost:6464/category/create-category', newCategory);
            setCategories([response.data.category, ...categories]); // Add new category to the list
            setNewCategory({ name: '', description: '' });
            handleCloseModal(); // Close modal after creation
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            {/* Create Category Button */}
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Create Category
            </Button>

            {/* Category Table */}
            <Paper style={{ marginTop: 20, overflow: "auto" }}>
                <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ position: 'sticky', top: 0 }}>
                            <TableRow>
                                <TableCell align="center" style={{ minWidth: 100, color: "#1976d2", fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ minWidth: 200, color: "#1976d2", fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No Categories Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell align="center">{category.name}</TableCell>
                                        <TableCell align="center">{category.description}</TableCell>
                                        <TableCell align="center">
                                            {new Date(category.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create Category Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <h2 >Create New Category</h2>
                    <TextField
                        label="Category Name"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 , marginTop: 1}}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateCategory}>
                        Create
                    </Button>
                    <Button onClick={() => setOpenModal(false)} sx={{marginLeft: 1}} variant="contained" color="warning" >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default CategoryTable;
