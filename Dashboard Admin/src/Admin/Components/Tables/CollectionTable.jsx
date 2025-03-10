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
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { MdModeEditOutline } from 'react-icons/md';
import { CgSearch } from 'react-icons/cg';


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


const CollectionTable = () => {
    const [collections, setCollections] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newCollection, setNewCollection] = useState({
        name: '',
        description: '',
        imageFile: null, // This will store the uploaded file
    });
        const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all collections
    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await axios.get('http://localhost:6464/collection/getall');
            setCollections(response.data);
        } catch (error) {
            console.error("Error fetching collections:", error);
        }
    };

    // Handle modal open/close
    const handleOpenModal = (collection = null) => {
        if (collection) {
            setNewCollection({
                name: collection.name,
                description: collection.description,
                image: collection.image,
            });
            setEditingId(collection._id);
            setEditMode(true);
        } else {
            setNewCollection({ name: '', description: '', image: '' });
            setEditMode(false);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditMode(false);
        setEditingId(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setNewCollection({
            ...newCollection,
            [e.target.name]: e.target.value,
        });
    };

    // Create or Update a collection
    const handleSubmitCollection = async () => {
        const formData = new FormData();
        formData.append('name', newCollection.name);
        formData.append('description', newCollection.description);
        formData.append('image', newCollection.imageFile); // Add the image file to FormData
    
        try {
            if (editMode) {
                // Update collection
                await axios.put(`http://localhost:6464/collection/update?_id=${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Create new collection
                await axios.post('http://localhost:6464/collection/create-collection', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            fetchCollections(); // Reload collections
            handleCloseModal();
        } catch (error) {
            console.error("Error saving collection:", error);
        }
    };
    

    // Search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container sx={{ marginTop: 5 }}>
            {/* Search Input */}
            <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
                <InputBase
                    sx={{ ml: 1, flex: 1, border: '1px solid grey', padding: '5px 10px', borderRadius: 0 }}
                    placeholder="Search Collections"
                    inputProps={{ 'aria-label': 'search collections' }}
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <IconButton type="button" aria-label="search">
                    <CgSearch />
                </IconButton>
            </Box>

            {/* Create Collection Button */}
            <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                Create Collection
            </Button>

            {/* Collection Table */}
            <Paper style={{ marginTop: 20, overflow: "auto" }}>
                <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ position: 'sticky', top: 0 }}>
                            <TableRow>
                                <TableCell align="center" style={{ minWidth: 100, color: "#1976d2", fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ minWidth: 200, color: "#1976d2", fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Image</TableCell>
                                <TableCell align="center" style={{ minWidth: 150, color: "#1976d2", fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCollections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No Collections Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCollections.map((collection) => (
                                    <TableRow key={collection._id}>
                                        <TableCell align="center">{collection.name}</TableCell>
                                        <TableCell align="center">{collection.description}</TableCell>
                                        <TableCell align="center">
                                            <img src={collection.image} alt={collection.name} width="50" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleOpenModal(collection)}>
                                                <MdModeEditOutline />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create/Update Collection Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
    <Box sx={modalStyle}>
        <h2>{editMode ? "Update Collection" : "Create New Collection"}</h2>
        <TextField
            label="Collection Name"
            name="name"
            value={newCollection.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 , marginTop: 2}}
        />
        <TextField
            label="Description"
            name="description"
            value={newCollection.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
        />
        {/* File input for image upload */}
        <input
            type="file"
            accept="image/*"
            onChange={(e) =>
                setNewCollection({
                    ...newCollection,
                    imageFile: e.target.files[0], // Store the selected file in state
                })
            }
        />
        <Button sx={{marginTop:3}} variant="contained" color="primary" onClick={handleSubmitCollection}>
            {editMode ? "Update" : "Create"}
        </Button>
        <Button onClick={() => setOpenModal(false)} sx={{marginLeft: 1, marginTop:3}} variant="contained" color="warning" >
                        Cancel
                    </Button>
    </Box>
</Modal>

        </Container>
    );
};

export default CollectionTable;
