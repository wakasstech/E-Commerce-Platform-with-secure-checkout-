import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Checkbox,
  FormControlLabel,
  ToggleButton, ToggleButtonGroup,
  LinearProgress,
  Input,
  Paper,
  Divider

} from '@mui/material';
import { styled } from '@mui/material/styles';
import "./NewForm.css"
import { Link } from 'react-router-dom';
import { CloudUpload, CheckCircle, Delete, CheckCircleOutline, TaskOutlined, PermMediaOutlined, DeleteOutlineOutlined, CheckCircleRounded, ArrowBackOutlined, AddHomeOutlined } from '@mui/icons-material';
import TestimonialsSlider from './compoenents/Slider';
import Header from './compoenents/Header';
import footer from '../../assests/images/bottom-footer.png'
import Swal from 'sweetalert2';
const steps = ['Step 1', 'Step 2', 'Step 3'];

// Custom StepConnector with red color for completed step and custom active styles
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    [`& .MuiStepConnector-line`]: {
      borderColor: '#D9D9D9',  // Change the line color
      borderTopWidth: 7,
      borderRadius: 20       // Line thickness
    },
    [`&.Mui-active .MuiStepConnector-line`]: {
      borderColor: '#F16725',  // Line color when active
    },
    [`&.Mui-completed .MuiStepConnector-line`]: {
      borderColor: '#F16725',  // Line color when step is completed
    },
  }));
  

const NewForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your form has been submitted successfully.",
      showCancelButton: false,
      confirmButtonText: "OK",
      // cancelButtonText: 'Cancel',
    });
  };


  //Step 2

  const [selectedDocument, setSelectedDocument] = useState('passport');

  const handleDocumentChange = (event, newDocument) => {
    if (newDocument !== null) {
      setSelectedDocument(newDocument);
    }
  };

  const [documentType, setDocumentType] = useState('passport');
  const [uploadedFiles, setUploadedFiles] = useState({
    front: null,
    back: null,
    file: null,
  });
  const [loading, setLoading] = useState({
    front: false,
    back: false,
    file: false,
  });
  const [progress, setProgress] = useState({
    front: 0,
    back: 0,
    file: 0,
  });

  const handleDocumentTypeChange = (event, newType) => {
    if (newType !== null) {
      setDocumentType(newType);
    }
  };

  const handleFileUpload = (side) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading((prev) => ({ ...prev, [side]: true }));
      setProgress((prev) => ({ ...prev, [side]: 0 }));

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev[side] + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadedFiles((prev) => ({
              ...prev,
              [side]: file.name,
            }));
            setLoading((prev) => ({ ...prev, [side]: false }));
          }
          return { ...prev, [side]: newProgress };
        });
      }, 300);
    }
  };

  const renderUploadButton = (side) => (
    <Box display="flex" alignItems="center" width="100%" >
      <Input
        type="file"
        onChange={handleFileUpload(side)}
        style={{ display: 'none' }}
        id={`upload-button-${side}`}
        inputProps={{ accept: 'image/*' }}
      />
      <label htmlFor={`upload-button-${side}`} style={{ width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload sx={{color: '#000000'}}/>}
          component="span"
          style={{ width: '100%', color: '#000000',fontSize: 12, border: '1px dashed grey', background: '#D9D9D9' }}
        >
          Upload Document
        </Button>
      </label>
    </Box>
  );

  const renderUploadedFile = (side) => (
    <Paper variant="outlined" style={{ padding: '8px 16px', marginBottom: 14, width: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1} >
      <PermMediaOutlined/>
          <Typography style={{ marginRight: 16, fontSize: 13, color: '#000000' , fontWeight: 500 }}>  {uploadedFiles[side]}</Typography>
        </Box>
       
        <Button onClick={() => setUploadedFiles((prev) => ({ ...prev, [side]: null }))}>
          <DeleteOutlineOutlined sx={{color: '#000000', fontSize: 16}}/>
        </Button>
      </Box>
      <Box sx={{padding: '0px 24px 0px 0px'}}>
      <LinearProgress
            variant="determinate"
            value={100}
            sx={{
                flexGrow: 1,
                marginRight: 2, // Adds margin on the right
              
                height: '6px', // Adjust the height of the bar
                borderRadius: '10px', // Rounded corners
                backgroundColor: '#e0e0e0', // Background color for the empty portion
                '& .MuiLinearProgress-bar': {
                  borderRadius: '10px', // Rounded corners for the progress bar itself
                  backgroundColor: '#25C56E', // Color of the progress bar
                },
              }}
          />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:1, marginTop: 0.5}}>
      <Typography variant="body2" color="grey"  fontWeight={500}> 
        Uploaded Successfully  
      </Typography>
      <CheckCircle sx={{color: "#25C56E", fontSize: 16}} />
      </Box>
      
    </Paper>
  );
  return (
    <div style={{backgroundColor: '#181818'}}>

  
    <Header/>
    <Box px={5} py={3}>
      <Grid container >
        {/* Left side section */}
        <Grid item xs={12} md={5} sx={{ borderTopLeftRadius: 10,borderBottomLeftRadius: 10,backgroundColor: '#3F3F3F', padding: '30px', color: 'white' }}>
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <div style={{marginBottom:20}}>
              <img src="https://www.sold4u2day.co.uk/images/logo/PNG%20-%20SOLD4U2day%20-%20logo%20-%20single%20colour.png" alt="Sold Icon" style={{ width: '100px', marginBottom: '30px' }} />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Register your Property
              </Typography>
              <Typography variant="body1" gutterBottom fontFamily={'sans-serif'}>
              ➨ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet hendrerit pharetra.
              </Typography>
              <Typography variant="body1" gutterBottom mt={2}  fontFamily={'sans-serif'}>
              ➨ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet hendrerit pharetra.
              </Typography>
              <Typography variant="body1" gutterBottom mt={2}  fontFamily={'sans-serif'}>
              ➨ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet hendrerit pharetra.
              </Typography>
            </div>
            {/* Testimonial box */}
            {/* <Box mt={4} bgcolor="#444" p={2} borderRadius={2}>
              <Typography variant="body2" gutterBottom>
                “I recently sold my home through [Website Name], and I couldn’t be happier with the experience!”
              </Typography>
              <Box display="flex" alignItems="center">
                <img
                  src="/agent-photo.jpg"
                  alt="Agent"
                  style={{ borderRadius: '50%', width: '50px', marginRight: '10px' }}
                />
                <div>
                  <Typography variant="subtitle2" color="white">
                    Robin Lambert
                  </Typography>
                  <Typography variant="caption" color="white">
                    Real Estate Agent
                  </Typography>
                </div>
              </Box>
            </Box> */}
            <TestimonialsSlider/>
          </Box>
        </Grid>

        {/* Right side form section */}
        <Grid item xs={12} md={7} sx={{ borderTopRightRadius: 10,borderBottomRightRadius: 10,padding: '30px', backgroundColor: '#fff' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={600}>Register</Typography>
            <Stepper
              activeStep={activeStep}
              connector={<CustomStepConnector />} 
              sx={{ mt: 2, mb: 4}} >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                   StepIconProps={{
                    sx: {
                        color: '#D9D9D9', // Default color for all steps
                      '&.Mui-active': {
                        color: '#F16725', // Active step icon color
                      },
                      '&.Mui-completed': {
                        color: '#F16725', // Completed step icon color
                      },
                    },
                  }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Multi-step form */}
          {activeStep === 0 && (
          <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
               <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>First Name</Typography>
              <TextField  fullWidth  className="input-field" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>Last Name</Typography>
            <TextField  fullWidth  className="input-field" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>Email ID</Typography>
            <TextField  fullWidth  className="input-field" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>Mobile Number</Typography>
              <TextField  fullWidth  className="input-field" variant="outlined" placeholder="+91"   />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>Password</Typography>
              <TextField  fullWidth  type="password" variant="outlined" className="input-field"  />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{color: 'grey', fontSize: 15, marginBottom:0.5}}>Confirm Password</Typography>
              <TextField  fullWidth type="password" variant="outlined" className="input-field" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel style={{color: 'grey'}}
                control={<Checkbox sx={{color: 'grey'}} />}
                label="I agree, Terms & Conditions"
              />
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
              <Typography variant="body2" sx={{ textAlign: 'right', marginBottom: '8px', color: 'grey', fontWeight: 600 }}>
                Forgot Password?
              </Typography>
            </Grid>
            <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {/* <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="contained"
              color="primary"
            >
              Back
            </Button> */}
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{background: '#F16725', 
                padding: '5px 25px',
                '&:hover': {
                    background: '#F16725',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Register'}
            </Button>
                   </Box>

            </Grid>
            <Box 
      sx={{
        display: 'flex',
        height: '1px', // Adjust thickness
        backgroundColor: '#dcdcdc', // Replace 'yourColor' with the desired color
        width: '100%', // Full width
        margin: '0px 50px',
        mt: 3, // Optional: margin for spacing
        mb: 1 // Optional: margin for spacing
      }}
    />   
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="body2" color="grey">
                Have an account?{' '}
                <Link href="/login" underline="hover" style={{color: '#F16725', fontWeight: 600}}>
                  Login here
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
          )}
           {activeStep === 1 && (
       <Box >
       <Typography variant="h6" gutterBottom 
sx={{color: '#00000', fontSize: 17, fontWeight: 600}}>
         Update Verification Code sent to your mobile & Email
       </Typography>
       <Grid container spacing={2} marginTop={3}>
      
  {/* Email Verification Code Label */}
  <Grid item xs={12} md={4}>
    <Typography sx={{color: '#00000', fontSize: 14, fontWeight: 600, marginTop: 1}}>
      Email Verification Code
    </Typography>
  </Grid>

  {/* Input Field */}
  <Grid item xs={12} md={8}>
    <TextField
      className="input-field"
      fullWidth
      placeholder="Enter 6 Digit Code"
      variant="outlined"
      sx={{
        '& .MuiInputBase-root': {
          height: '40px', // Adjust height as needed
        },
      }}
    />
  </Grid>

  {/* Resend Code Button */}
  <Grid item xs={12} md={12} paddingTop={0} marginTop={0}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 0 }}>
      <Button
       
        sx={{
            color: '#F16725',
          textTransform: 'none',
          padding: '6px 12px',
          marginTop: '-18px', // Adjust the margin to reduce spacing between input and button
        }}
      >
        Resend Code
      </Button>
    </Box>
  </Grid>


   {/* Email Verification Code Label */}
   <Grid item xs={12} md={4}>
   <Typography sx={{color: '#00000', fontSize: 14, fontWeight: 600, marginTop: 1}}>
      Email Verification Code
    </Typography>
  </Grid>

  {/* Input Field */}
  <Grid item xs={12} md={8}>
    <TextField
      className="input-field"
      fullWidth
      placeholder="Enter 6 Digit Code"
      variant="outlined"
      sx={{
        '& .MuiInputBase-root': {
          height: '40px', // Adjust height as needed
        },
      }}
    />
  </Grid>

  {/* Resend Code Button */}
  <Grid item xs={12} md={12} paddingTop={0} marginTop={0}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 0 }}>
      <Button
        sx={{
          textTransform: 'none',
          color: '#F16725',
          padding: '6px 12px',
          marginTop: '-18px', // Adjust the margin to reduce spacing between input and button
        }}
      >
        Resend Code
      </Button>
    </Box>
  </Grid>
</Grid>






<Grid item xs={12} mt={14}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
             
              sx={{color: 'grey', background: '#fff'}}
              startIcon={<ArrowBackOutlined/>}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{background: '#F16725', 
                padding: '5px 25px',
                '&:hover': {
                    background: '#F16725',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Register'}
            </Button>
                   </Box>

            </Grid>
            <Box display={"flex"} justifyContent={"center"}>
            <Box 
      sx={{
        display: 'flex',
        height: '1px', // Adjust thickness
        backgroundColor: '#dcdcdc', // Replace 'yourColor' with the desired color
        width: '100%', // Full width
        margin: '0px 50px',
        // marginRight: 50,
        mt: 3, // Optional: margin for spacing
        mb: 1 // Optional: margin for spacing
      }}
    />  
            </Box> 
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="body2" color="grey">
                Have an account?{' '}
                <Link href="/login" underline="hover" style={{color: '#F16725', fontWeight: 600}}>
                  Login here
                </Link>
              </Typography>
            </Grid>
       
     </Box>
     
        
          )}

          {activeStep === 2 && (
         <Box p={0}>
         <Typography  gutterBottom sx={{color: '#00000', fontSize: 18, fontWeight: 600, marginBottom:3}}>
           Upload your Identity Documents
         </Typography>
         <Grid container spacing={2}>
           <Grid item xs={12} >
           <Box display="flex"   sx={{
            gap:4,
            alignItems: {
                xs: 'start', // Flex direction for small screens
                md: 'center',    // Flex direction for medium and larger screens
              },
    flexDirection: {
      xs: 'column', // Flex direction for small screens
      md: 'row',    // Flex direction for medium and larger screens
    }
  }}>
           
      <Typography  style={{ marginRight: 16, color: '#00000', fontSize: 14, fontWeight: 600 }}>
        Choose Document :
      </Typography>
      <ToggleButtonGroup
        value={selectedDocument}
        exclusive
        onChange={handleDocumentChange}
        aria-label="document selection"
        sx={{
          gap: 0,
        }}
      >
        <ToggleButton
          value="passport"
          aria-label="passport"
          sx={{
            fontWeight: 600,
            border: '1px solid #F16725',
            color: selectedDocument === 'passport' ? '#F16725' : '#757575',
            backgroundColor: selectedDocument === 'passport' ? '#F1672510' : 'transparent',
             borderRadius: 3, // Rounded corners for left button
            '&.Mui-selected': {
              color: '#F16725',
              backgroundColor: '#F1672520',
              '&:hover': {
                backgroundColor: '#F1672540',
              },
            },
            '& .MuiToggleButton-label': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          Passport
          {selectedDocument === 'passport' && (
            <CheckCircleRounded sx={{ marginLeft: 1, fontSize: 18, color: '#F16725' }} />
          )}
        </ToggleButton>
        <ToggleButton
          value="driving-license"
          aria-label="driving license"
          sx={{
            fontWeight: 600,
            border: '1px solid #F16725',
            color: selectedDocument === 'driving-license' ? '#F16725' : '#757575',
            backgroundColor: selectedDocument === 'driving-license' ? '#F1672510' : 'transparent',
            borderRadius: 3, // Rounded corners for right button
            '&.Mui-selected': {
              color: '#F16725',
              backgroundColor: '#F1672520',
              '&:hover': {
                backgroundColor: '#F1672540',
              },
            },
            '& .MuiToggleButton-label': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          Driving License
          {selectedDocument === 'driving-license' && (
            <CheckCircleRounded sx={{ marginLeft: 1, fontSize: 18, color: '#F16725' }} />
          )}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
           </Grid>
   
           {['front', 'back', 'file'].map((side) => (
             <Grid item xs={12} key={side}>
               <Typography  gutterBottom sx={{color: '#00000', fontSize: 14, fontWeight: 600}}>
                 {`Upload ${side.charAt(0).toUpperCase() + side.slice(1)} side`}
               </Typography>
               {loading[side] ? (
                 <Box display="flex" alignItems="center" width="100%">
                   <LinearProgress
                     variant="determinate"
                     value={progress[side]}
                    
                     sx={{
                        flexGrow: 1,
                        marginRight: 2, // Adds margin on the right
                      
                        height: '6px', // Adjust the height of the bar
                        borderRadius: '10px', // Rounded corners
                        backgroundColor: '#e0e0e0', // Background color for the empty portion
                        '& .MuiLinearProgress-bar': {
                          borderRadius: '10px', // Rounded corners for the progress bar itself
                          backgroundColor: '#25C56E', // Color of the progress bar
                        },
                      }}
                   />
                   <Typography variant="body2" color="textSecondary">
                     {`${progress[side]}%`}
                   </Typography>
                 </Box>
               ) : uploadedFiles[side] ? (
                 renderUploadedFile(side)
               ) : (
                 renderUploadButton(side)
               )}
             </Grid>
           ))}
         </Grid>


         <Grid item xs={12} mt={11}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
             
              sx={{color: 'grey', background: '#fff'}}
              startIcon={<ArrowBackOutlined/>}
            >
              Back
            </Button>
            <Button
            //   onClick={handleNext}
              variant="contained"
              onClick={handleSuccess}
              sx={{background: '#F16725', 
                padding: '5px 25px',
                '&:hover': {
                    background: '#F16725',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Register'}
            </Button>
                   </Box>

            </Grid>
            <Box display={"flex"} justifyContent={"center"}>
            <Box 
      sx={{
        display: 'flex',
        height: '1px', // Adjust thickness
        backgroundColor: '#dcdcdc', // Replace 'yourColor' with the desired color
        width: '100%', // Full width
        margin: '0px 50px',
        // marginRight: 50,
        mt: 3, // Optional: margin for spacing
        mb: 1 // Optional: margin for spacing
      }}
    />  
            </Box>
            
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="body2" color="grey">
                Have an account?{' '}
                <Link href="/login" underline="hover" style={{color: '#F16725', fontWeight: 600}}>
                  Login here
                </Link>
              </Typography>
            </Grid>
       </Box>
          )}

 
          
        </Grid>
      </Grid>
    </Box>
   
    </div>
  );
};

export default NewForm;