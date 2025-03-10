
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler}  = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");
const { User } = require("../modals/userModel.js");


 const verifyJWT = asyncHandler(async(req, res, next) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
      // console.log(token);
      if (!token) {
          throw new ApiError(401, "Unauthorized request")
      }
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
      if (!user) {
          throw new ApiError(401, "Invalid Access Token")
      }
      req.user = user;
      next()
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
  }
})
const adminMiddleware = (req, res, next) => {
    // Assuming req.user is set after authentication and contains user roles
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admins only can do this' });
    }
  };
 

module.exports={
  verifyJWT,
  adminMiddleware,

  
}  