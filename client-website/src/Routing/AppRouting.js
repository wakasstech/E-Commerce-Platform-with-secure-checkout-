



import React from 'react';
import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import Home from "../pages/Home/Home";
import Products from "../pages/ProductsMen&Women/Products";
import Collections from '../pages/Collections/Collections';
import ProductSection from '../pages/ProductSelection/ProductSelection';
import CartPage from '../pages/CartPage/CartPage';
import AboutUs from '../pages/AboutUs/AboutUs';
import ContactUs from '../pages/ContactUs/ContactUs';
import OrderPage from '../pages/OrderPage/OrderPage';
import NewForm from '../pages/NewForm/NewForm';
import Checkout from '../pages/Checkout/Checkout';

const AppRouting = () => (
  <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/men" element={<Products initialCategory="Men" />} />
    <Route path="/women" element={<Products initialCategory="Women" />} />
    <Route path="/collections" element={<Collections/>} />
    <Route path="/productSection" element={<ProductSection/>} />
    <Route path="/products" element={<Products />} />
    <Route path="/carts" element={<CartPage />} />
    {/* <Route path="/orders" element={<OrderPage />} /> */}

    <Route path="/home" element={<Home/>} />
    <Route path="/contactUs" element={<ContactUs />} />

    <Route path="/aboutUs" element={<AboutUs />} />


    <Route path="*" element={<div><h1>Page Not Found</h1></div>} />
    <Route path="/signin" element={<SignIn/>}  />
    <Route path="/signup" element={<SignUp/>}  />
    <Route path="/checkout" element={<Checkout/>}  />

  </Routes>
);

export default AppRouting;
