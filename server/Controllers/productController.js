const Category = require('../modals/categoryModel'); 
const Product = require('../modals/productModel');
const fs = require('fs'); 
const { uploadOnCloudinary, deleteOnCloudinary } = require('../utils/cloudinary.js');
const createProduct = async (req, res) => {
    try {
        const { title, price, discountPrice, category, collection, description ,color,size} = req.body;
        // Check if a product with the same title already exists
        const existingProduct = await Product.findOne({ title });
        if (existingProduct) {
            return res.status(400).json({ error: 'A product with this title already exists.' });
        }
        // Validate that category exists
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            return res.status(400).json({ error: 'Invalid category.' });
        }
        let imageUrl = null;
        let imagePid = null;
        // Upload image to Cloudinary if provided
        if (req.file) {
            const cloudinary_res = await uploadOnCloudinary(req.file.path);
            imageUrl = cloudinary_res.url;
            imagePid = cloudinary_res.public_id;

            // Remove the image from the local file system
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file from local system:', err);
                } else {
                    console.log('File deleted from local system');
                }
            });
        }
        const parsedColor = typeof color === 'string' ? JSON.parse(color) : color;
        const parsedSize = typeof size === 'string' ? JSON.parse(size) : size;
        const product = new Product({
            title,
            price,
            discountPrice,
            image: imageUrl,
            image_pid: imagePid,
            category,
            collection,
            description,
            color:parsedColor,
            size:parsedSize
        });
        await product.save();
        console.log(product,"product")
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.query;
        const product = await Product.findById(id)
    
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getTopRatedProducts = async (req, res) => {
    try {
        console.log("in the controller")
        const products = await Product.find({ rating: { $gte: 5 } }).limit(8)

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found with a rating of 5 or higher' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, price, discountPrice, category, collection, description } = req.body;
        // Validate that category and subcategory exist if they are being updated
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ error: 'Invalid category' });
            }
        }
        let updateData = {
            title,
            price,
            discountPrice,
            category,
       collection,
            description
        };

        // Handle image update
        if (req.file) {
            const product = await Product.findById(id);

            // Delete the old image from Cloudinary if it exists
            if (product.image_pid) {
                await deleteOnCloudinary(product.image_pid);
            }
            const cloudinary_res = await uploadOnCloudinary(req.file.path);
            updateData.image = cloudinary_res.url;
            updateData.image_pid = cloudinary_res.public_id;
            // Remove the image from the local file system
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file from local system:', err);
                } else {
                    console.log('File deleted from local system');
                }
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getProductByCollection = async (req, res) => {
    try {
        
        const { collection } = req.query;
     
        const products = await Product.find({ collection });

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for this collection' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.query; 
        
       console.log(category)
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for this category' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByCollection,
    updateProduct,
    getTopRatedProducts,
    getProductByCategory
};
