
const cron = require('node-cron')
const bcrypt = require("bcryptjs");
const userService = require("../Services/userServices");
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
const multer = require('multer')
const path = require('path');
const { response } = require("express");
const { json } = require("body-parser");
const e = require("express");
var  User =  db.userModel;
const Order = require('../modals/orderModel');



const sendEmailonPaymentAdmin = async (emailPayload) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
  })
  const htmlContentPayment = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Action Required</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              font-size: 16px;
              margin: 0;
              padding: 0;
              background-color: #f0ddc2;
              color: #333;
          }
          .container {
              max-width: 550px;
              margin: 20px auto;
              padding: 20px;
          }
          .message {
              background-color: #f9f9f9;
              border-top: 4px solid #FFC107; /* Yellow top border */
              border-bottom: 4px solid #FFC107; /* Yellow bottom border */
              padding: 40px 20px;
              border-radius: 8px;
              margin-top: 20px;
          }
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo img {
              width: 400px;
              height: 100px;
          }
          .message p {
              margin: 16px 0;
          }
          ul {
              list-style-type: none;
              padding: 0;
          }
          ul li {
              font-size: 16px;
              margin-bottom: 8px;
          }
          .note {
              margin-top: 20px;
              font-size: 14px;
              color: #888;
              font-style: italic;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="message">
              <div class="logo">
                  <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
              </div>
              <p>Dear Support Team,</p>
              <p>I'm pleased to inform you that <strong>${emailPayload.userFirstName} ${emailPayload.userLastName}</strong> has successfully paid the fee for an online order with <strong>Arshy Mualla</strong> via Stripe. The client's details are as follows:</p>
              <ul>
                  <li><strong>Name:</strong> ${emailPayload.userFirstName} ${emailPayload.userLastName}</li>
                  <li><strong>Email:</strong> ${emailPayload.userEmail}</li>
                  <li><strong>Phone Number:</strong> ${emailPayload.userNumber}</li>
                  <li><strong>Order Total Amount:</strong> $${emailPayload.totalAmount}</li>
                  <li><strong>Payment Status:</strong> ${emailPayload.paymentStatus}</li>
              </ul>
                <p>He orders for the following items:</p>
              <ul>
                  ${emailPayload.products.map(product => `
                      <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - $${(product.price * product.quantity).toFixed(2)}</li>
                  `).join('')}
              </ul>
              <p>Please ensure that the payment has been recorded accurately and that the client's file is updated accordingly.</p>
              <p>Thank you!</p>
              <div class="note">
                  *This is an automated email. If you have already been notified, please ignore this message.
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
  
  
let info = await transporter.sendMail({
    from: 'hafiznizaqatali@gmail.com',
    to: `hafiznizaqatali@gmail.com`, // list of receivers
    text: 'Arshe Muallah',
     subject: 'Payment Received',
    html: htmlContentPayment,
  });
  if (info.messageId) {
      console.log(info, 84)
      if (info.messageId) {
        console.log(info, 84);
        return { success: true, message: 'Email sent strip payment to  admin' };
      } else {
        return { success: true, message: 'Email  not sent strip payment  to  admin' };
      }
    }
}
const sendEmailonPaymentClient= async (emailPayload) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
  })
  const htmlContentClient =`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Thank You</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              font-size: 16px;
              margin: 0;
              padding: 0;
              background-color: #f0ddc2;
              color: #333;
          }
          .container {
              max-width: 550px;
              margin: 20px auto;
              padding: 20px;
          }
          .message {
              background-color: #f9f9f9;
              border-top: 4px solid #FFC107; /* Yellow top border */
              border-bottom: 4px solid #FFC107; /* Yellow bottom border */
              padding: 40px 20px;
              border-radius: 8px;
              margin-top: 20px;
          }
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo img {
              width: 400px;
              height: 100px;
          }
          .message p {
              margin: 16px 0;
          }
          ul {
              list-style-type: none;
              padding: 0;
          }
          ul li {
              font-size: 16px;
              margin-bottom: 8px;
          }
          .note {
              margin-top: 20px;
              font-size: 14px;
              color: #888;
              font-style: italic;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="message">
              <div class="logo">
                  <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
              </div>
              <p>Dear ${emailPayload.userFirstName} ${emailPayload.userLastName},</p>
              <p>Thank you for your payment! We have successfully received your payment for your online order with <strong>Arshy Mualla</strong>. Here are the details of your transaction:</p>
             <ul>
                  <li><strong>Name:</strong> ${emailPayload.userFirstName} ${emailPayload.userLastName}</li>
                  <li><strong>Email:</strong> ${emailPayload.userEmail}</li>
                  <li><strong>Order ID:</strong> ${emailPayload.orderId}</li>
                  <li><strong>Payment Date:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Amount Paid:</strong> $${emailPayload.totalAmount.toFixed(2)}</li>
              </ul>
              <p>Your order includes the following items:</p>
              <ul>
                  ${emailPayload.products.map(product => `
                      <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - $${(product.price * product.quantity).toFixed(2)}</li>
                  `).join('')}
              </ul>
              <p>Our team will begin processing your order shortly. If you have any questions or need further assistance, please feel free to reach out to us.</p>
              <p>Thank you for choosing <strong>Arshy Mualla</strong>!</p>
              <div class="note">
                  *This is a confirmation email for your records. Please keep it for future reference.
              </div>
          </div>
      </div>
  </body>
  </html>
`;




  
let info = await transporter.sendMail({
    from: 'no-reply@fincensafe.com',
    to: `hafiznizaqatali@gmail.com`, // list of receivers
     subject: 'Confirmation of Payment',
    html: htmlContentClient,
  });
  if (info.messageId) {
      console.log(info, 84)
      if (info.messageId) {
        console.log(info, 84);
        return { success: true, message: 'Email sent strip payment to  Client' };
      } else {
          return { success: false, message: 'Email sent strip payment to  Client' };}
    }
}
// Endpoint to Send OTP
const sendotp = async (req, res) => {
    const { orderId } = req.body;
  
    // Find the order by orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ code: 404, message: 'Order not found' });
    }
  
    // Extract email from order's shippingContact
    const email = order.shippingContact?.email;
    if (!email) {
      return res.status(404).json({ code: 404, message: 'Email not found in order shipping contact' });
    }
  
    let foundotp, _otp;
  
    // OTP Generation Configuration
    let length = 8;
    let numberAllowed = true;
  
    // Generate a unique OTP
    do {
      let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      if (numberAllowed) str += "0123456789";
  
      _otp = 'S-';
      const usedChars = new Set();
  
      while (_otp.length < length + 2) {
        let charIndex = Math.floor(Math.random() * str.length);
        let char = str.charAt(charIndex);
        if (!usedChars.has(char)) {
          _otp += char;
          usedChars.add(char);
        }
      }
  
      // Check if OTP is unique in the Order collection
      foundotp = await Order.findOne({ otp: _otp });
    } while (foundotp);
  
    console.log('Generated OTP:', _otp);
  
    // Send OTP via Email
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
      from: 'hafiznizaqatali@gmail.com',
      to: 'hafiznizaqatali@gmail.com',
      subject: 'Your OTP for Order Update',
      text: `Your OTP is ${_otp} for updating order ${orderId}`,
    });
  
    if (info.messageId) {
      // Save OTP in the order
      order.otp = _otp;
      order.otpUsed = false;
      await order.save();
    } else {
      return res.status(500).json({ code: 500, message: 'Failed to send OTP' });
    }
  
    // OTP Expiration with Cron
    const cronExpression = '*/3 * * * *';
    let fn_run = 1;
  
    cron.schedule(cronExpression, async () => {
      if (order && fn_run === 1) {
        fn_run = 0;
        order.otp = null;
        await order.save();
        console.log('OTP invalidated after 3 minutes');
      }
    });
  
    res.status(200).json({ code: 200, message: 'OTP sent successfully', orderId });
  };
  
  

  const submitotp = async (req, res) => {
    try {
      const { otp, orderId, line_items,DiscountedAmout } = req.body;
  
      // Validate required fields
      if (!otp || !orderId || !line_items) {
        return res.status(400).json({
          code: 400,
          message: "Missing required fields",
          status: false,
        });
      }
  
      // Find the order by orderId and OTP
      const order = await Order.findOne({ _id: orderId, otp });
      if (!order) {
        return res.status(404).json({ code: 404, message: 'Invalid OTP or order not found' });
      }
  
      // Check if the OTP was already used
      if (order.otpUsed) {
        return res.status(400).json({ code: 400, message: 'OTP has already been used' });
      }
  
      // Mark OTP as used and clear it
      order.otpUsed = true;
      order.otp = null;
  
      // Define delivery charge
      const deliveryCharge = 150;
  
      // Validate and update line_items, and prepare chosen products and payment details for the response
      let totalProductAmount = 0;
      const chosenProducts = line_items.map(item => {
        if (!item.price_data || !item.price_data.currency || !item.price_data.unit_amount || !item.quantity) {
          throw new Error("Invalid line item data format");
        }
        const productTotal = item.price_data.unit_amount * item.quantity;
        totalProductAmount += productTotal;
        // Map each product's details for the response
        return {
          name: item.price_data.product_data.name,               // Product name
          product_id: item.price_data.product_data.metadata.product_id, // Unique product ID
          color: item.price_data.product_data.metadata.color,     // Product color
          size: item.price_data.product_data.metadata.size,       // Product size
          unit_price: item.price_data.unit_amount,                // Unit price
          quantity: item.quantity,                                // Quantity ordered
          total: productTotal,                                    // Total cost for this product
        };
      });
      // Calculate total payment amount including delivery charge
      const totalPaymentAmount = totalProductAmount + deliveryCharge;
  
      // Update the order with new line items and total amount
      order.products = chosenProducts.map(product => ({
        name: product.name,
        quantity: product.quantity,
        price: product.unit_price,
        size: product.size,
        color: product.color,
      }));
      order.totalAmount = totalPaymentAmount;
      order.DiscountedAmount = DiscountedAmout || 0;
      await order.save();
  
      // Prepare email payload
      const emailPayload = {
        userEmail: order.shippingContact.email,
        userNumber: order.shippingContact.phone,
        userFirstName: order.shippingAddress.firstName,
        userLastName: order.shippingAddress.lastName,
        products: chosenProducts,
        totalAmount: totalPaymentAmount,
        DiscountedAmout: DiscountedAmout || 0,
        paymentStatus: "pending", // Assuming "pending" if not explicitly set by a session
      };
 
      // Send emails
      const sendEmailonPaymentAdmin = await sendCodOrderConfirmationAdmin(emailPayload);
      const sendEmailonPaymentClient = await sendCodOrderConfirmationClient(emailPayload);
      console.log('Admin Email:', sendEmailonPaymentAdmin);
      console.log('Client Email:', sendEmailonPaymentClient);
      console.log(`Order ${orderId} updated successfully with new line items`);
  
      // Response with order, chosen products, and total payment details
      res.status(200).json({
        code: 200,
        message: 'Order updated successfully after OTP verification',
        orderId: order._id,
        chosenProducts,  // Array of product details
        paymentDetails: {
          currency: line_items[0]?.price_data.currency || 'N/A',
          productAmount: totalProductAmount,
          deliveryCharge,
          totalAmount: totalPaymentAmount,
        },
        order,
      });
    } catch (err) {
      console.error('Error:', err.message || err);
      return res.status(500).json({ code: 500, message: 'Server error' });
    }
  };
  
  
  const sendCodOrderConfirmationAdmin = async (emailPayload) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
    });
    
    const htmlContentAdmin = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Cash on Delivery</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0ddc2; color: #333; }
            .container { max-width: 550px; margin: 20px auto; padding: 20px; }
            .message { background-color: #f9f9f9; border: 4px solid #FFC107; padding: 40px 20px; border-radius: 8px; }
            .logo img { width: 400px; height: 100px; }
            ul { list-style-type: none; padding: 0; }
            ul li { font-size: 16px; margin-bottom: 8px; }
            .note { font-size: 14px; color: #888; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">
                <div class="logo">
                    <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
                </div>
                <p>Dear Support Team,</p>
                <p>A cash-on-delivery order has been placed by <strong>${emailPayload.userFirstName} ${emailPayload.userLastName}</strong> for the following items:</p>
                <ul>
                    ${emailPayload.products.map(product => `
                        <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - Rs.${(product.unit_price * product.quantity).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p>Please confirm the order details and prepare for shipment.</p>
                <div class="note">
                    *This is an automated notification. No further action is required if you have been previously notified.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    
    let info = await transporter.sendMail({
      from: 'no-reply@fincensafe.com',
      to: 'hafiznizaqatali@gmail.com',
      subject: 'Order Confirmation - Cash on Delivery',
      html: htmlContentAdmin,
    });
    
    return info.messageId ? { success: true, message: 'COD order confirmation email sent to admin' } : { success: false, message: 'Failed to send COD order confirmation email to admin' };
  };
  
  
  const sendCodOrderConfirmationClient = async (emailPayload) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
    });
    
    const htmlContentClient = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Cash on Delivery</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0ddc2; color: #333; }
            .container { max-width: 550px; margin: 20px auto; padding: 20px; }
            .message { background-color: #f9f9f9; border: 4px solid #FFC107; padding: 40px 20px; border-radius: 8px; }
            .logo img { width: 400px; height: 100px; }
            ul { list-style-type: none; padding: 0; }
            ul li { font-size: 16px; margin-bottom: 8px; }
            .note { font-size: 14px; color: #888; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">
                <div class="logo">
                    <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
                </div>
                <p>Dear ${emailPayload.userFirstName} ${emailPayload.userLastName},</p>
                <p>Thank you for your order with <strong>Arshy Mualla</strong>. We have received your cash-on-delivery order. Here are the details:</p>
               <ul>
                ${emailPayload.products.map(product => `
                    <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - Rs.${(product.unit_price * product.quantity).toFixed(2)}</li>
                `).join('')}
                
                <!-- Conditional Discounted Amount Line -->
                ${emailPayload.DiscountedAmount ? `
                    <li><strong>Discounted Amount:</strong> Rs.${emailPayload.DiscountedAmount.toFixed(2)}</li>
                ` : ''}
                
                <li><strong>Total Amount:</strong> Rs.${emailPayload.totalAmount.toFixed(2)}</li>
            </ul>
                <p>Your order will be processed shortly. If you have any questions, feel free to contact us.</p>
                <div class="note">
                    *This email serves as your order confirmation. Please keep it for your records.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    
    let info = await transporter.sendMail({
      from: 'no-reply@fincensafe.com',
      to: emailPayload.userEmail,
      subject: 'Order Confirmation - Cash on Delivery',
      html: htmlContentClient,
    });
    
    return info.messageId ? { success: true, message: 'COD order confirmation email sent to client' } : { success: false, message: 'Failed to send COD order confirmation email to client' };
  };
  const sendEasyPaisaOrderConfirmationAdmin = async (emailPayload) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
    });
  
    const htmlContentAdmin = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - EasyPaisa/JazzCash Payment</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0ddc2; color: #333; }
            .container { max-width: 550px; margin: 20px auto; padding: 20px; }
            .message { background-color: #f9f9f9; border: 4px solid #FFC107; padding: 40px 20px; border-radius: 8px; }
            .logo img { width: 400px; height: 100px; }
            ul { list-style-type: none; padding: 0; }
            ul li { font-size: 16px; margin-bottom: 8px; }
            .note { font-size: 14px; color: #888; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">
                <div class="logo">
                    <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
                </div>
                <p>Dear Support Team,</p>
                <p>An order has been placed with EasyPaisa/JazzCash by <strong>${emailPayload.userFirstName} ${emailPayload.userLastName}</strong> for the following items:</p>
                <ul>
                    ${emailPayload.products.map(product => `
                        <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - $${(product.unit_price * product.quantity).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p>Please verify the payment details, confirm receipt, and prepare the order for shipment.</p>
                <div class="note">
                    *This is an automated notification. Please verify payment receipt before proceeding with the order.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  
    let info = await transporter.sendMail({
      from: 'no-reply@fincensafe.com',
      to: 'hafiznizaqatali@gmail.com',
      subject: 'Order Confirmation - EasyPaisa/JazzCash Payment',
      html: htmlContentAdmin,
    });
  
    return info.messageId ? { success: true, message: 'Payment order confirmation email sent to admin' } : { success: false, message: 'Failed to send payment order confirmation email to admin' };
  };
  
  const sendEasyPaisaOrderConfirmationClient = async (emailPayload) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUR_EMAIL1,
        pass: process.env.EMAIL_PASSWORD1
      },
      tls: {
        servername: 'smtp.gmail.com',
      },
    });
  
    const htmlContentClient = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - EasyPaisa/JazzCash Payment</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0ddc2; color: #333; }
            .container { max-width: 550px; margin: 20px auto; padding: 20px; }
            .message { background-color: #f9f9f9; border: 4px solid #FFC107; padding: 40px 20px; border-radius: 8px; }
            .logo img { width: 400px; height: 100px; }
            ul { list-style-type: none; padding: 0; }
            ul li { font-size: 16px; margin-bottom: 8px; }
            .note { font-size: 14px; color: #888; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">
                <div class="logo">
                    <img src="https://res.cloudinary.com/dqcimdgce/image/upload/v1730230922/AM_sfq9ar.jpg" alt="Arshy Mualla Logo">
                </div>
                <p>Dear ${emailPayload.userFirstName} ${emailPayload.userLastName},</p>
                <p>Thank you for your order with <strong>Arshy Mualla</strong> using EasyPaisa/JazzCash. We have received your payment screenshot. Once our team verifies the payment, your order will be processed for delivery as soon as possible.</p>
                <ul>
                    ${emailPayload.products.map(product => `
                        <li>${product.quantity} x ${product.name} (Size: ${product.size}, Color: ${product.color}) - $${(product.unit_price * product.quantity).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <div class="note">
                    *This email confirms your order. Our support team will contact you if any further details are needed.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  
    let info = await transporter.sendMail({
      from: 'no-reply@fincensafe.com',
      to: emailPayload.userEmail,
      subject: 'Order Confirmation - EasyPaisa/JazzCash Payment',
      html: htmlContentClient,
    });
  
    return info.messageId ? { success: true, message: 'Payment order confirmation email sent to client' } : { success: false, message: 'Failed to send payment order confirmation email to client' };
  };
  
module.exports = {
    sendotp,
    submitotp,
sendEmailonPaymentAdmin,
sendEmailonPaymentClient,
sendCodOrderConfirmationAdmin,
sendCodOrderConfirmationClient,
sendEasyPaisaOrderConfirmationAdmin ,
sendEasyPaisaOrderConfirmationClient




};