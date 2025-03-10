const categoryController = require("../Controllers/categoryController");
const express = require("express");
const router = express.Router();
const auth = require("../MiddleWares/auth");
const { verifyJWT } = require("../MiddleWares/auth");
const { upload } = require("../MiddleWares/multer.middleware");
 router.post("/create-category", categoryController.createCategory);
 router.get("/get-categories", categoryController.getCategories);
module.exports = router;