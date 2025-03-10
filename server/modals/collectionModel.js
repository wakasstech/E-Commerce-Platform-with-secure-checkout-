const mongoose = require('mongoose');
const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String, // Image URL 
    },
    image_pid: {
        type: String, 
    },
}, {
    timestamps: true
});
const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
