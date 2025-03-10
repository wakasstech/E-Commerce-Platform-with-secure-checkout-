
const cron = require('node-cron')
const bcrypt = require("bcryptjs");

const  {asyncHandler} = require("../utils/asyncHandler.js");
const  {ApiResponse}  = require('../utils/ApiResponse.js');
const mongoose = require("mongoose");
const  {ApiError}  = require('../utils/ApiError.js');
const FormData = require('form-data');
const nodemailer = require('nodemailer');
const userModel = require("../modals/userModel");
const auth = require("../MiddleWares/auth");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Readable } = require('stream');
var db = require('../modals/index.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { response } = require("express");
const { json } = require("body-parser");
//var  User =  db.userModel;
const {User} = require("../modals/userModel.js");

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })
      return {accessToken, refreshToken}
  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}
const registerUser = asyncHandler( async (req, res) => {
  console.log(" in the register corner ")
  
  const { email, username, password } = req.body
  //console.log("email: ", email);
  if (
      [ email, username, password].some((field) => field?.trim() === "")
  ) {
      throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
      $or: [{ username:username }, { email:email }]
  })

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
 

  const user = await User.create({
    ...req.body
  })
  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )
  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }
  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  )
})
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password))
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });
  await userService.login(email, (err, result) => {
    if (err) return res.status(400).send(err);
    const hashedPassword = result.password;
    if (!bcrypt.compareSync(password, hashedPassword))
      return res
        .status(400)
        .send({ errMessage: "Your email/password is wrong!" });
        console.log("result........",result)
     result.token = auth.generateToken(result.id.toString(), result.email);
     result.password = undefined;  
     result.__v = undefined;
    return res
      .status(200)
      .send({ message: "User login successful!", user: result });
  });
};

const getUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
  ))
})
const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})
const getTrimName = async (req, res) => {
  try {
    const full_name = req.body.full_name.replace(/\s+/g, ' ').trim();
    // Split the full name into individual words
    const name_parts = full_name.split(" ");
    // Extract first name, middle name, and last name
    const first_name = name_parts[0].trim();
    const middle_name = name_parts.length > 2 ? name_parts[1].trim() : "";
    const last_name = name_parts.length > 1 ? name_parts[name_parts.length - 1].trim() : "";
    //const last_name = name_parts[name_parts.length - 1];
    // Print the results (console.log instead of print)
    console.log("First Name:", first_name);
    console.log("Middle Name:", middle_name);
    console.log("Last Name:", last_name);
    // Return the result in the response
    const result = {
      first_name,
      middle_name,
      last_name,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getById = async (req, res) => {
  const userId =   req.body.userId;
  console.log("userId......",userId);
  await userService.getById(userId, (err, result) => {
    if (err) return res.status(404).send(err);
    result.password = undefined;
    return res.status(200).send(result);
  });
};
const getUserWithMail = async(req,res) => {
  const {email} = req.body;
  await userService.getUserWithMail(email,(err,result)=>{
    if(err) return res.status(404).send(err);
    const dataTransferObject = {
      user: result.id,
      name: result.name,
      surname: result.surname,
      color: result.color,
      email : result.email
    };
    return res.status(200).send(dataTransferObject);
  })
}
const updateUser = async (req, res) => {
  try {
      const id = req.user.id;
     

      const updatedUser = await userService.updateUser(id, { ...req.body });
      // Now it should be defined
      res.status(200).json(updatedUser);
  } catch (err) {
      res.status(500).json(err);
  }
};
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If the user already exists, send a custom error response
      return res.status(400).json({ error: 'User with this email already exists.' });
    } else {
      // If the user doesn't exist, send a success message
      return res.status(200).json({ message: 'Email is available.' });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const sendotp = async (req, res) => {
const user = await User.findOne({
  email: req.body.email,
});
  if (!user) {
    return res.status(404).json({ code: 404, message: 'User not found' });
  }

  let foundotp;
  let _otp;

  // Configuration for OTP generation
  let length = 8; // Length of the OTP
  let numberAllowed = true; // Whether numbers are allowed
  let charAllowed = true; // Whether special characters are allowed
  do {
    // Initialize the character set
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";
    // Generate OTP
    _otp = 'S-';
    const usedChars = new Set();
    while (_otp.length < length + 2) { // '+ 2' to account for the prefix 'S-'
      let charIndex = Math.floor(Math.random() * str.length);
      let char = str.charAt(charIndex);
      // Ensure no repeated characters
      if (!usedChars.has(char)) {
        _otp += char;
        usedChars.add(char);
      }
    }
    // Check if the OTP already exists in the database
    foundotp = await User.findOne({
      where: {
        otp: _otp,
      },
    });
  } while (foundotp);

  console.log('New OTP:', _otp);

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.OUR_EMAIL1,
      pass: process.env.EMAIL_PASSWORD1,
    },
    tls: {
      servername: 'smtp.gmail.com',
    },
  });
  let info = await transporter.sendMail({
    from: 'no-reply',
    to: `${req.body.email}`,
    subject: 'Your Otp For Password  Update',
    text: String(_otp),
  });
  if (info.messageId) {
    console.log(info, 84);
    await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          otp: _otp,
          otpUsed: false,
        },
      }
    );
    await user.save();
  } else {
    res.status(500).json({ code: 500, message: 'Server error' });
  }
  const cronExpression = '*/3 * * * *';
  let fn_run = 1;
  cron.schedule(cronExpression, async () => {
    if (user && fn_run == 1) {
      fn_run = 0;
      user.otp = null;
      await user.save();
      console.log('OTP invalidated after 2 minutes');
    }
  });
  res.status(200).json({ code: 200, message: 'OTP sent' });
};
const submitotp = async (req, res) => {
  try {
      // Validate the request body
      const { email, otp, password } = req.body;
      if (!email || !otp || !password) {
          return res.status(400).json({
              message: "Missing Fields",
              status: false
          });
      }

      console.log(req.body, "Request body data");

      // Find user by email and OTP
      const user = await User.findOne({
          email: email.trim(), // Trim to avoid whitespace issues
          otp: otp.trim()      // Trim to avoid whitespace issues
      });

      console.log(user, "User found");

      if (!user) {
          return res.status(404).json({ code: 404, message: 'OTP not found' });
      }
      user.password = password; 
      user.otpUsed = true;
      const saved = await user.save();

      if (saved) {
          console.log(saved, "User updated with new password and OTP marked as used");
          return res.status(200).json({ code: 200, message: 'Updated password successfully' });
      } else {
          return res.status(500).json({ code: 500, message: 'Failed to update user' });
      }

  } catch (err) {
      console.error('Error:', err); // Log the error for debugging
      return res.status(500).json({ code: 500, message: 'Server error' });
  }
};


const getAllUser = async (req, res) => {
  try{
    console.log("in the get all users")
    const users = await User.find().select('-password -_id');

  
  
  console.log(users[0])
  if(users){
      console.log("In users ")
    res.status(200).json(users);
  }
  else{
      res.status(404).json("Error Occurred");
  }
  }
  catch(err){
      res.status(404).json(err);
  }
};


const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, password} = req.body


  if ( !email) {
      throw new ApiError(400, " email is required")
  }
  
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
      
  // }
  const user = await User.findOne({
      $or: [ {email}]
  })
  if (!user) {
      throw new ApiError(404, "User does not exist")
  }
console.log(password)
 const isPasswordValid = await user.isPasswordCorrect(password)
 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )
})


module.exports = {
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser,
  sendotp,
  submitotp,
  checkEmail,
  getById,
getTrimName,
registerUser,
loginUser ,
logoutUser,

};