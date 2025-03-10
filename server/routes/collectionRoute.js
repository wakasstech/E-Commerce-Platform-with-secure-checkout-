const express = require('express');
const {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection
} = require('../Controllers/collectionController');
const {upload} =require('../MiddleWares/multer.middleware');
const router = express.Router();

// Routes
router.post('/create-collection', upload.single('image'), createCollection); 
router.get('/getall', getAllCollections);
router.get('/getbyid', getCollectionById); 
router.put('/update', upload.single('image'), updateCollection); 

module.exports = router;
