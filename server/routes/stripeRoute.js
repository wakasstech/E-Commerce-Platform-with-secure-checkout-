const express = require("express");


const stripeController = require("../Controllers/stripeController");
const router = express.Router();
const auth = require('../MiddleWares/auth'); 
router.post("/sessions", stripeController.sessionStripe);
router.get("/complete", stripeController.statusStripe);
router.get("/cancel", stripeController.cancelStripe);
// router.post("/webhookstrip", stripeController.webhook);
module.exports = router;