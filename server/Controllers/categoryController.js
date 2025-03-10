const Category = require('../modals/categoryModel'); // Adjust path as needed

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, parent, description, image } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = new Category({ name, parent, description, image });
        const savedCategory = await category.save();
        return res.status(201).json({ message: 'Category created successfully', category: savedCategory });
    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        return res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (err) {
        console.error('Error fetching category:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    try {
        const { name, parent, description, image } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, parent, description, image }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
