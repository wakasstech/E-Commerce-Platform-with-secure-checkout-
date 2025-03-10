

  

  
import React, { useEffect, useState } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  TextField,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jazzCash from "../../../assests/images/jazzcash.png"
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

const PaymentForm = ({ onBack, orderId, userEmail }) => {

  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("Stripe");
  const [cart, setCart] = useState([]);
  const finalAmountAddCarts = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // Controls form step within modal
  const [otp, setOtp] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const [couponModalOpen, setCouponModalOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);



  const handleStripePayment = async () => {
    const payload = {
      orderId:orderId,
      line_items: cart.map(item => ({
        price_data: {
          currency: 'pkr',
          product_data: {
            name: item.title,
            metadata: {
              color: item.color,
              size: item.size,
            },
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post('http://localhost:6464/stripe/sessions', payload);
      const { stripeUrl } = response.data;

      // Redirect to Stripe checkout
      if (stripeUrl) {
        window.location.href = stripeUrl;
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error);
    }
  }

  const proceedToOrder =async () => {


    if (paymentType === "Stripe")
    {
     await handleStripePayment()
    } else {
      setModalOpen(true); // Open modal for next steps based on payment type
      setStep(1); // Reset to step 1 on each modal open
    }
   
  };
    const handleCompleteOrder =async () => {
     
      if (paymentType === "Stripe")  {
        await proceedToOrder()
      } else {
            setCouponModalOpen(true); // Open coupon modal
      }
   
  };



  const handleCloseModal = () => {
    setModalOpen(false);
   
    setStep(1); // Reset step when closing modal
  };

  // const handleOTPVerification = () => {
  //   console.log(`OTP: ${otp}`);
  //   localStorage.removeItem("cart"); // Clear cart on success
  //   handleCloseModal(); // Close modal after OTP verification
  //   Swal.fire("Order placed successfully!", "Our team will connect with you shortly to discuss the next steps. In the meantime, please ensure that you keep an eye on your email for updates.", "success");
    
  //   navigate("/");

    
  // };

  const handleOTPVerification = async () => {
  
    setLoading(true);
    try {
      const payload = {
        orderId:orderId,
        otp:otp,
        DiscountedAmount:finalAmount,
        line_items: cart.map(item => ({
          price_data: {
            currency: 'pkr',
            product_data: {
              name: item.title,
              metadata: {
                color: item.color,
                size: item.size,
              },
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
      };
      // Send OTP for verification
      const response = await axios.post('http://localhost:6464/order/submit_otp', payload);
  
      if (response.status === 200) {
        // Clear local storage items
        localStorage.removeItem('cart');
        setFinalAmount(0);
        // Close modal
        handleCloseModal();
  
        // Show success message with a custom button
        Swal.fire({
          title: 'Order placed successfully!',
          text: 'Our team will connect with you shortly to discuss the next steps. In the meantime, please ensure that you keep an eye on your email for updates.',
          icon: 'success',
          confirmButtonText: 'Go To Home',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to home page when "Go To Home" is clicked
            navigate('/');
          }
        });
      }
    } catch (error) {
      console.error('Error submitting OTP:', error);
      // Handle error (optional)
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotUpload = async () => {
    if (!screenshot) {
      setErrors((prev) => ({ ...prev, screenshot: "Please upload your payment screenshot." }));
      return;
    }

    const formData = new FormData();
    formData.append("paymentReceipt", screenshot);
    
    setLoading(true)
    try {
      const response = await axios.put(`http://localhost:6464/order/upload-receipt?orderId=${orderId}`, formData);
      // Swal.fire("Order placed successfully!", "Your payment screenshot has been uploaded.", "success");
      // localStorage.removeItem("cart");
      // handleCloseModal();
      if (response.status === 200) {
        // Clear local storage items
        localStorage.removeItem('cart');
  
        // Close modal
        handleCloseModal();
  
        // Show success message with a custom button
        Swal.fire({
          title: 'Order placed successfully!',
          text: 'Our team will connect with you shortly to discuss the next steps. In the meantime, please ensure that you keep an eye on your email for updates.',
          icon: 'success',
          confirmButtonText: 'Go To Home',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to home page when "Go To Home" is clicked
            navigate('/');
          }
        });
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    } finally {
      setLoading(false)
    }
  };
  const handleNextAccountInfo = () => {
    const validationErrors = {};
    if (!accountNumber) validationErrors.accountNumber = "Account number is required.";
    if (!accountHolderName) validationErrors.accountHolderName = "Account holder name is required.";
    if (!transactionId) validationErrors.transactionId = "Transaction ID is required.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStep(3); // Move to screenshot upload step
    }
  };

  const sendOTP = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:6464/order/send_otp', {
        orderId: orderId,
      });
  
      if (response.status === 200) {
        // If the API call is successful, set step to 2
        setStep(2);
        console.log('OTP sent successfully');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Handle any errors (optional)
    } finally { 
      setLoading(false)
    }
 
  };

  const handleMobilePayment = async () => {

    alert(finalAmount);
    setLoading(true)
    try {

      const payload = {
        orderId: orderId,
        paymentType: 'JazzCash/EasyPaisa',
        DiscountedAmount:finalAmount,
        line_items: cart.map(item => ({
          price_data: {
            currency: 'pkr',
            product_data: {
              name: item.title,
              metadata: {
                color: item.color,
                size: item.size,
              },
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
      };

      const response = await axios.put('http://localhost:6464/order/update', payload);
  
      if (response.status === 200) {
        // Set the step to 2 on success
        setFinalAmount(0);
        setStep(2);
        console.log('Payment type updated successfully.');
      }
    } catch (error) {
      console.error('Error updating payment type:', error);
      // Handle error if needed
    } finally {
      setLoading(false)
    }
  };

  const handleApplyCoupon = async () => {
//  const payload =  { email: userEmail,
//  couponCode: couponCode,
//  orderTotal: finalAmountAddCarts }
//  console.log(payload, 'payload')

    try {
      const response = await axios.post("http://localhost:6464/coupon/apply", {
        email: userEmail,
        couponCode: couponCode,
        orderTotal: finalAmountAddCarts
      });
  
      if (response.status === 200) {
        Swal.fire("Coupon applied successfully!", "", "success");
        setFinalAmount(response.data.finalAmount);
        setCouponModalOpen(false);
        setCouponCode("")
        // Small delay to ensure modal state updates before proceeding
        setTimeout(() => {
          Swal.fire("Coupon applied successfully!", "", "success").then(() => {
            proceedToOrder();
          });
        }, 100); // Delay of 100ms to allow modal to close
      }
    } catch (error) {
      Swal.fire("Invalid coupon or already used", "Please try again", "error");
    }
  };


  return (
    <Box sx={{ mt: 4, mb:10 }}>
      {loading ? 
      <LoadingScreen/>
    :
    (
      <React.Fragment>
      <FormControl component="fieldset">
      <RadioGroup value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
        {[
          {
            value: "COD",
            label: "Cash on Delivery",
            description: "Pay with COD",
            imgSrc: "https://cdn-icons-png.freepik.com/256/12340/12340964.png?semt=ais_hybrid",
          },
          {
            value: "Easypaisa",
            label: "Easypaisa",
            description: "Pay with Easy Paisa",
            imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaaTOoXTDQOvZm4ww25iaxPd9rB3_IBWBnD91rH0L6BQ-_Eg0DHeEc40T7oeQcRKR8Saw&usqp=CAU",
          },
          {
            value: "JazzCash",
            label: "JazzCash",
            description: "Pay securely with JazzCash",
            imgSrc: "https://seeklogo.com/images/J/jazz-cash-logo-829841352F-seeklogo.com.png",
          },
          {
            value: "Stripe",
            label: "Stripe",
            description: "Pay with Stripe (International)",
            imgSrc: "https://media.licdn.com/dms/image/v2/D4D12AQEH143bZ1Q92g/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1709625955980?e=2147483647&v=beta&t=V1SY9TkE_-tceclmrv_6gcMcRQEHjKT_z9eU2tOsdvo",
          },
        ].map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
              />
            }
            label={
              <Box
                sx={{
                  width: { xs: "300px", sm: "400px" }, // Responsive width
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  border: "1px solid #B2BCCA",
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  mb: 2,
                }}
              >
                <Typography color="black" fontWeight={600} textAlign="center" sx={{ flex: 1 }}>
                  {option.label}
                </Typography>
                <Typography color="black" textAlign="center" sx={{ flex: 1 }}>
                  {option.description}
                </Typography>
                <img
                  src={option.imgSrc}
                  alt={option.label}
                  width={60}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
    
    
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onBack}
              sx={{
                mr: 3,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteOrder}
              sx={{
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Go for order
            </Button>
          </Box>
    
          {/* Modal for Next Steps */}
          <Modal open={modalOpen} >
            <Box
              sx={{
                p: 4,
                bgcolor: "background.paper",
                borderRadius: 1,
                mx: "auto" ,
                mt: 10,
                width: {
                  xs: 300, // 90% width on extra-small screens (mobile)
                  sm: 300,   // 400px width on small screens
                  md: 450,   // 450px width on medium screens and up
                },
                position: "relative",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
    
              {paymentType === "COD" ? (
                step === 1 ? (
                  <Box>
                    <Typography variant="h6" gutterBottom textAlign={"center"} mt={3} fontWeight={"bold"}>
                      Cash on Delivery (COD) Verification
                    </Typography>
                    <Typography variant="body2" textAlign={"center"} fontSize={16} >
                      We will send an OTP verification code to your email that you entered earlier. Please check.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', 
                     
                    }}>
                    <Button
                      variant="contained"
                      color="primary"
                      // onClick={() => setStep(2)}
                      onClick={sendOTP}
                      sx={{ mt: 3,  background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}}
                    >
                      Send
                    </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Enter OTP <span style={{fontSize:14, color: 'grey'}}>(Please check your email inbox/spam)</span>
                    </Typography>
                    <TextField
                      label="OTP"
                      fullWidth
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ mt: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOTPVerification}
                      sx={{ mt: 2 ,background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}}
                    >
                      Submit
                    </Button>
                  </Box>
                )
              ) : paymentType === "Easypaisa" || paymentType === "JazzCash" ? (
                step === 1 ? (
                  <Box>
                    <Typography variant="h6" gutterBottom textAlign="center" mt={3} fontWeight="bold">
                      PAYFAST (JazzCash/Easypaisa) Instructions
                    </Typography>
                    <Typography variant="body2" textAlign="center" fontSize={16} mt={3}>
                      For JazzCash/Easypaisa, please upload a screenshot of your payment. Do not close this application tab until the screenshot is uploaded.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', 
                     
                    }}>
                    <Button
                      variant="contained"
                      color="primary"
                      // onClick={() => setStep(2)}
                      onClick={handleMobilePayment}
                      sx={{ mt: 5,background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}} 
                    >
                      Next
                    </Button>
                    </Box>
                  </Box>
                ) : step === 2 ? (
                  <Box>
                    <Typography variant="h6" gutterBottom textAlign="center" mt={3} fontWeight="bold">
                      Account Information
                    </Typography>
                    <TextField
                      label="Account Number"
                      fullWidth
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      error={!!errors.accountNumber}
                      helperText={errors.accountNumber}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Account Holder Name"
                      fullWidth
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      error={!!errors.accountHolderName}
                      helperText={errors.accountHolderName}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label={paymentType === "Easypaisa" ? "Txt ID*": "T ID*"} 
                      fullWidth
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      error={!!errors.transactionId}
                      helperText={errors.transactionId}
                      sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: "flex", gap:3, mt: 3 }}>
                      <Button sx={{background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}}
                      variant="contained" color="primary" onClick={() => setStep(3)}>
                        Skip
                      </Button>
                      <Button sx={{background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}} variant="contained" color="primary" onClick={handleNextAccountInfo}>
                        Next
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom textAlign="center" mt={3} fontWeight="bold">
                      Upload Payment Screenshot
                    </Typography>
                    <input
                      type="file"
                      onChange={(e) => {
                        setScreenshot(e.target.files[0]);
                        setErrors((prev) => ({ ...prev, screenshot: "" }));
                      }}
                      accept="image/*"
                      style={{
                        marginTop: 16,
                        backgroundColor: "#E0F7FA",
                        border: "2px dashed #0288D1",
                        padding: "8px",
                        borderRadius: "4px",
                        width: "90%",
                      }}
                    />
                    {errors.screenshot && (
                      <Typography color="error" sx={{ mt: 1 }}>
                        {errors.screenshot}
                      </Typography>
                    )}
                      <Box sx={{display: 'flex', justifyContent: 'center', 
                     
                    }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleScreenshotUpload}
                      sx={{ mt: 4 ,background: 'orangered',
                        '&:hover': {
                          background: 'orangered'
                        }}}
                    >
                      Submit
                    </Button>
                    </Box>
                  </Box>
                )
              ) : (
                <Typography variant="body1">
                  Order completed successfully!
                </Typography>
              )}
            </Box>
          </Modal>


           {/* Coupon Code Modal */}
           <Modal open={couponModalOpen} >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: "90%",
                maxWidth: 400,
                textAlign: "center",
              }}
            >
              <IconButton
                onClick={()=> setCouponModalOpen(false)}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" mb={2}>
                Enter Discount Coupon Code if you have
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="text" onClick={() => {
                  setFinalAmount(finalAmountAddCarts);
                  setCouponModalOpen(false);
                  setCouponCode("");
                  proceedToOrder();
                }}>
                  Skip
                </Button>
                <Button variant="contained" onClick={handleApplyCoupon}>
                  Next
                </Button>
              </Box>
            </Box>
          </Modal>
          </React.Fragment>
    )
    }
  
    </Box>
  );
};

export default PaymentForm;

  