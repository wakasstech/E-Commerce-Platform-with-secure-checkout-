const Collection = require('../modals/collectionModel');
const {uploadOnCloudinary,deleteOnCloudinary} = require('../utils/cloudinary.js');


const fs = require('fs'); 
const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find()
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCollectionById = async (req, res) => {
    try {
        console.log(req.query._id,"req.query._id")
        const  id  = req.query._id;
        console.log(id)
        const collection = await Collection.findById(id)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createCollection = async (req, res) => {
    try {
        const { name, description } = req.body;

        let image = null;
        let image_pid = null;

        // Check if an image file is present in the request
        if (req.file) {
            const cloudinaryRes = await uploadOnCloudinary(req.file.path);
            image = cloudinaryRes.url;
            image_pid = cloudinaryRes.public_id;

            // Delete the file from the local system after uploading to Cloudinary
            if (cloudinaryRes && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file from local system:', err);
                    } else {
                        console.log('File deleted from local system');
                    }
                });
            }
        }

        const collection = new Collection({
            name,
           
            description,
            image,
            image_pid
        });

        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCollection = async (req, res) => {
    try {
        const  id  = req.query._id;
        const { name,description } = req.body;

        let updatedData = { name, description };

        if (req.file) {
            // Find the existing collection to delete the old image from Cloudinary
            const existingCollection = await Collection.findById(id);
            if (!existingCollection) {
                return res.status(404).json({ error: 'Collection not found' });
            }

            // Delete the old image from Cloudinary
            if (existingCollection.image_pid) {
                await deleteOnCloudinary(existingCollection.image_pid);
            }

            // Upload the new image to Cloudinary
            const cloudinaryRes = await uploadOnCloudinary(req.file.path);
            updatedData.image = cloudinaryRes.url;
            updatedData.image_pid = cloudinaryRes.public_id;

            // Delete the file from the local system after uploading to Cloudinary
            if (cloudinaryRes && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file from local system:', err);
                    } else {
                        console.log('File deleted from local system');
                    }
                });
            }
        }

        const collection = await Collection.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true } // Return the updated document
        );

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection
};
