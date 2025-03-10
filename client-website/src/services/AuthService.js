// src/services/authService.js
import axios from "../utils/axios";

export const registerUser = async (user) => {
  const response = await axios.post("/user/create", user);
  return response.data;
};

export const loginUser = async (user) => {
  const response = await axios.post("/user/userlogin", user);
  return response.data;
};
