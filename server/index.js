const auth = require('./MiddleWares/auth.js');
const dotenv=require('dotenv')
const cors = require('cors');
const express = require('express');
const unless = require('express-unless');
const {Sequelize} = require('sequelize');
const bodyParser = require("body-parser");

const session = require("express-session");
const {connectDB} = require("./db/index.js");
const stripeController = require("./Controllers/stripeController.js");
//const setupRoles = require('./MiddleWares/setupRoles.js');
//  Passing parameters separately (other dialects)
const app = express()
app.use(cors()); 
app.use('/stripe/webhookstrip', express.raw({ type: 'application/json' }), stripeController.webhook);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(
  session({
    secret: "dfsf94835asda",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json({ limit: '150mb' }));
 dotenv.config({path:'./config.env'});
 app.use(cors());
 app.use("/Images", express.static("Images"));
 //routes
 const userRoute = require("./routes/userRouter.js");
 const categoryRoute = require("./routes/categoryRouter.js");
 const collectionRoute = require("./routes/collectionRoute.js");
 const productRoute = require("./routes/productRouter");
 const stripeRoute = require("./routes/stripeRoute");
 const cartRoute = require("./routes/cartRoute");
 const orderRoute = require("./routes/orderRoute");
 const couponRoute = require("./routes/couponRoute");
// middleware
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/collection', collectionRoute);
app.use('/product', productRoute);
app.use('/stripe', stripeRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/coupon', couponRoute);
connectDB()
.then(() => {

app.listen(process.env.PORT || 9090, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT || 9090}`);
});
})
.catch((err) => {
    console.log("MONGO db connection failed !! ", err);
})
//   app.listen(process.env.PORT,()=>{
//     console.log(" Server is running on port 5000");
// });


