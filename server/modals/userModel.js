const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Sequelize, DataTypes } = require('sequelize');  // Ensure DataTypes is imported

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
     
        avatar: {
            type: String, // cloudinary url
        },
        role: {
            type: String,
            default: "user"
        },
        address: {
            street: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            zipCode: {
                type: String,
                trim: true
            },
            country: {
                type: String,
                trim: true
            }
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        coverImage: {
            url: {
                type: String,
                
            },
            publicId: {
                type: String,
              
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        otp: {
            type: String,
        },
        otpUsed: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model("User", userSchema);
module.exports = { User };
//export const User = mongoose.model("User", userSchema)