
//const { createRandomHexColor } = require("./helperMethods");
var db = require('../modals/index.js');
var  User =  db.userModel;
const axios = require("axios");
const cron = require('node-cron');
const register = async (user, callback) => {
  try {
    const newUser = await User.create({...user});
 await newUser.save();
    callback(null, { message: "User created successfully!"});
    console.log("new user created successfully") 
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const uniqueViolation = err.errors.find(error => error.type === 'unique violation');
      if (uniqueViolation) {
        return callback({
          errMessage: "Email already in use!  && 1 if  you  have  already  submitted  your  application  then  ypu  can  not  be  edit  this  after  submission  otherwise  use   another email  to  Register!   ",
          details: uniqueViolation,
        });
      } else {
        return callback({
          errMessage: "Something went wrong",
          details: err.message,
        });
      }
    }
  }
}
const login = async (email, callback) => {
  console.log(email,"in the service ")
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return callback({ errMessage: "Your email is not found" });
    console.log("userrrrrrrrrrrrrrrrr",user.toJSON());
    return callback(false, user.toJSON());
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getUser = async (id, callback) => {
  try {
    let user = await User.findByPk(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getById = async (id, callback) => {
  try {
    let user = await User.findByPk(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getAllUser = async ( callback) => {
  try {
    console.log("Get All users")
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude password field
    });
    console.log("we  have :",users.length,"users")
    console.log("there we get users" , users.slice(1 , 2))
    
    if (!users) {
        console.log("No Users")
        return callback({ errMessage: "Users not found!" });
    }
    else {
        console.log("users")
        return callback(false, users);
    }
  } catch (err) {
      console.log(err)
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getAllFiles = async (userId, callback) => {
  try {
    const userId = userId; // Assuming you have authentication middleware setting req.user
console.log(userId,"klkkkkl");
    // Fetch user data including uploaded files
    const user = await userService.getUserWithFiles(userId);

    // Extract and send the list of uploaded files
    const uploadedFiles = {
      schedule_pdf: user.schedule_pdf_name,
      driving_licence: user.driving_licence_name,
      FormA1099: user.FormA1099_name,
      FormB1099: user.FormB1099_name,
      ks22020: user.ks22020_name,
      ks2020: user.ks2020_name,
      Tax_Return_2020: user.Tax_Return_2020_name,
      Tax_Return_2021: user.Tax_Return_2021_name,
      supplemental_attachment_2020: user.supplemental_attachment_2020_name,
      supplemental_attachment_2021: user.supplemental_attachment_2021_name,
    };
    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error getting uploaded files:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getUserWithMail = async (email, callback) => {
  try {
    let user = await User.findOne({ where: { email } });
    if (!user)
      return callback({
        errMessage: "There is no registered user with this e-mail.",
      });
    return callback(false, { ...user.toJSON() });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
}; 
const updateUser = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    console.log(updateData);
    const user = await User.findByPk(id);
    console.log(user.step,"user stepppp");
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
 
  
    
    
    // Dynamically update user properties based on updateData
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        user[key] = updateData[key];
      }
    }
    // Save the changes to the database
    await user.save();
    let fn = user.first_name;
    let ln = user.last_name;
    let mn = user.middle_name;
    let em = user.email;
        // Check if the 'step' property is being updated and its value is 0
    if (user.step == 6 && user.pre_Qalified_email!="true") {
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendemailonfirststep',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendonfirststep successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
          // send  email  to  admin1
{
  
  
        try {
          // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
          const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
            // Include any data you want to send in the request body
            // For example, you might want to send user data
          process:"Pre Qualification" , fn:fn,ln:ln,em:em,mn:mn
          });
          // Check if the response indicates success (adjust the condition based on your API response)
          if (response.status === 200) {
            console.log('HTTP POST request to https://app.setczone.com/api/user/sendprocessemail successful');
            // Do something with the response data if needed
            // For example, you can access it using response.data
          } else {
            // Handle unexpected response status
            console.error('Unexpected HTTP response status:', response.status);
          }
        } catch (error) {
          // Handle network errors, request timeouts, or any other errors
          console.error('Error making HTTP POST request:', error.message);
        }
     
      }
   user.pre_Qalified_email="true"
      user.save();
    }
    return { status: 200, user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    return {status:500 ,error};
  }
};

const uploadForm = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    const user = await User.findByPk(id);
    if (!user) {
      return { error: 'User not found' };
    }
    // // Dynamically update user properties based on updateData
    // for (const key in updateData) {
    //   if (updateData.hasOwnProperty(key)) {
    //     user[key] = updateData[key];
    //   } 
    // }
     // Dynamically update user properties based on updateData
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          // Check if the field is an array and already exists
          if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
            // If yes, append new values to the existing array
            user[key] = user[key].concat(updateData[key]);
          } else {
            // Otherwise, update the field with the new value
            user[key] = updateData[key];
          }
        }
      }
     
const allFilesSelected = () => {
  return (
    user?.schedule_pdf?.length > 0 &&
    user?.Tax_Return_2020?.length > 0 &&
    user?.Tax_Return_2021?.length > 0
  );
  };
  
  const allFilesSelectedAdditional = () => {
  return (
    user?.schedule_pdf?.length > 0 &&
    user?.Tax_Return_2020?.length > 0 &&
    user?.Tax_Return_2021?.length > 0 &&
    user?.supplemental_attachment_2020?.length > 0 &&
    user?.supplemental_attachment_2021?.length > 0 &&
    user?.FormA1099?.length > 0 &&
    user?.FormB1099?.length > 0 &&
    user?.ks2020?.length > 0 &&
    user?.ks22020?.length > 0
  );
  };
if (user.Family_Sick_Leave === "Yes") {
  if (allFilesSelectedAdditional() && user.notify !="yes" && user.applicationStatus) {
    let fn = user.first_name;
    let ln = user.last_name;
    let mn = user.middle_name;
      let em = user.email;
//     //user email
    {
      try {
        const response = await axios.post('https://app.setczone.com/api/user/sendemailOnNinteenstep2',{
         
          user
        });
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail192 successful');
        
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
// //admin1 email
    {
  
  
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
        process:" Portal document uploaded " , fn:fn,ln:ln,em:em,mn:mn
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendprocessemail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
    // send  email  to  admin
    {
      console.log("user", user);
    
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendEmail',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    } 

  

    user.notify="yes";
  user.process_2=true
  }
} else {
  if (allFilesSelected() && user.notify !="yes" && user.applicationStatus) {
    let fn = user.first_name;
    let ln = user.last_name;
    let mn = user.middle_name;
    let em = user.email;
    //user email
    {
      try {
        console.log("send  email  to  user...............................");
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendemailOnNinteenstep2',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail192 successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
// //admin1 email
    {
  
      try {
        console.log("send  email  to  admin1..............................");
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
        process:"Portal - Full Documents uploaded " , fn:fn,ln:ln,em:em,mn:mn
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendprocessemail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
    // send  email  to  admin
    {
      console.log("send  email  to  admin........................................");
    
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendEmail',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    } 

      user.notify="yes";
    user.process_2=true

  }
}
// yahan tak  for  email  and  process 2
  
    // Save the changes to the database
    
    await user.save();
    return { status: 200, message: "Application  Submitted  succesfully", user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle specific error cases
    if (error.message === 'User not found') {
      return { status: 404, error: 'User not found' };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};
const uploadFormPreSignatureFileUpload = async (id) => {
  try {
    console.log("updateUser function called with id:", id);
    const user = await User.findByPk(id);
    user.process_4=true;
    if (!user) {
      return { error: 'User not found' };
    }
    let fn = user.first_name;
    let em = user.email;
    let ln = user.last_name;
  
    // Save the changes to the database
    await user.save();
    return { status: 200, message: "johns  file  uploaded  and  Ready  to  E_signature", user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle specific error cases
    if (error.message === 'User not found') {
      return { status: 404, error: 'User not found' };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};

const submitOtp = async (otp, newPassword) => {
  try {
    const result = await User.findOne({ otp: otp });
    if (!result) {
      throw { code: 404, message: 'OTP not found' };
    }
    if (result.otpUsed) {
      throw { code: 400, message: 'OTP already used' };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Mark the OTP as used and update the password
    await User.updateOne(
      { email: result.email, otpUsed: false }, // Only update if otpUsed is false
      { otpUsed: true, password: hashedPassword }
    );
    return { code: 200, message: 'Password updated' };
  } catch (err) {
    throw { code: 500, message: 'Server error' };
  }
};
const deleteUser = async (userId, callback) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return callback({
        errMessage: 'User not found',
      });
    }
    await user.destroy();
    return callback(null, { message: 'User deleted successfully' });
  } catch (err) {
    return callback({
      errMessage: 'Error deleting user',
      details: err.message,
    });
  }
};
// Inside userService.js
const updateApplication = async (userId) => {
 
  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    user.applicationStatus=true;
    // Save the updated user
    await user.save();
     let fn= user.first_name;
     let ln= user.last_name;
     let mn= user.mn_name;
     let em= user.email;
    console.log(user.first_name,"user before  submit  later  application")
  {
    //send email  to the user
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmailonsubmit later
        const response = await axios.post('https://app.setczone.com/api/user/sendemailOnNinteenstep',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail19 successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
    // send  email  to  the  admin1
    {
  
  
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
        process:"Add Document Later",  fn:fn,ln:ln,em:em,mn:mn
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to https://app.setczone.com/api/user/sendprocessemail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
    // send  email  to   admin 
        // send  email  to  admin
        {
          console.log("user", user);
        
          try {
            // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
            const response = await axios.post('https://app.setczone.com/api/user/sendEmail',{
              // Include any data you want to send in the request body
              // For example, you might want to send user data
              user
            });
            // Check if the response indicates success (adjust the condition based on your API response)
            if (response.status === 200) {
              console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail successful');
              // Do something with the response data if needed
              // For example, you can access it using response.data
            } else {
              // Handle unexpected response status
              console.error('Unexpected HTTP response status:', response.status);
            }
          } catch (error) {
            // Handle network errors, request timeouts, or any other errors
            console.error('Error making HTTP POST request:', error.message);
          }
        } 
  
    
    
    

    return {user: user};
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};

const verfication = async (userId) => {
  try {
    console.log("uogis")
    const user = await User.findByPk(userId);
    
    
    if (!user) {
      return { error: 'User not found' };
    }
  
     //admin1 email
     {
       try {
         // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
         const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
           // Include any data you want to send in the request body
           // For example, you might want to send user data
           process:"verified by Admin,Docs Missing " , fn:fn,ln:ln,mn:mn,em:em
         });
         // Check if the response indicates success (adjust the condition based on your API response)
         if (response.status === 200) {
           console.log('submit now  to  admin1  on  verification');
           // Do something with the response data if needed
           // For example, you can access it using response.data
         } else {
           // Handle unexpected response status
           console.error('Unexpected HTTP response status:', response.status);
         }
       } catch (error) {
         // Handle network errors, request timeouts, or any other errors
         console.error('Error making HTTP POST request:', error.message);
       }
     }
     //john email
     {
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendemailoffice',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
   user, value:" verified and is awaiting SETC calculation",subject:" Lead Verified"
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('send  email to  office  on  verification');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
  // } else {
  //   console.log("User notifiy positive, skipping email sending.");
  // }

        // Schedule a cron job to set isProcess to true after 2 minutes
        const cronExpression1minut = '*/1 * * * *'; // Runs every 2 minutes
        const cronExpression24 = '0 0 * * *'; // Runs every day at midnight
        let fn_run =1;
        cron.schedule(cronExpression24, async () => {
          const updatedUser = await User.findByPk(userId);
           let fn = updatedUser.first_name;
    let ln = updatedUser.last_name;
    let mn = updatedUser.middle_name;
    let em = updatedUser.email;
 console.log("updatedUser.process_3",updatedUser.process_3)
          console.log("now   testing  your  email if  process_3 is  already true then  email  will  not  sent")
          if (updatedUser.process_3 != true && fn_run  == 1) {
                console.log("now   testing  your  email if  process_3 is  not true so   email  will  have sent  and  process  3 will also  trigger")
              fn_run=0;
            updatedUser.isProcess = true;
            updatedUser.process_3=true;
            await updatedUser.save();
          
            //admin1
             { 
            //   sendprocessemail
              try {
                  console.log("In Try Block")
                // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
                const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
                  // Include any data you want to send in the request body
                  // For example, you might want to send user data
                process:"Application  in Process", fn : fn , ln: ln,em:em,mn:mn
                });
            
                // Check if the response indicates success (adjust the condition based on your API response)
                if (response.status === 200) {
                      console.log("Admin1 email has been  sent : -------------------" )
                  // Do something with the response data if needed
                  // For example, you can access it using response.data
                } else {
                  // Handle unexpected response status
                  console.error('Unexpected HTTP response status:', response.status);
                }
              } catch (error) {
                // Handle network errors, request timeouts, or any other errors
                console.error('Error making HTTP POST request:', error.message);
              }
            }
              //user email
     try {
  // make an http post request to https://app.setczone.com/api/user/sendemail
  const response = await axios.post('https://app.setczone.com/api/user/senduseremailprocess',{
    // include any data you want to send in the request body
    // for example, you might want to send user data
    user
  });
  console.log("response in second step of mail" , response)
  // check if the response indicates success (adjust the condition based on your api response)
  if (response.status === 200) {
        console.log("process client   email has been  sent : -------------------" )
    // do something with the response data if needed
    // for example, you can access it using response.data
  } else {
    // handle unexpected response status
    console.error('unexpected http response status:', response.status);
  }
} catch (error) {
  // handle network errors, request timeouts, or any other errors
  console.error('error making http post request:', error.message);
}
            console.log('isProcess set to true after 2 minutes');
          }
        },
        // {
        //   scheduled: false, // Do not start the job immediately
        // }
        );
    return { user: user };
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const notverfication = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    // Check if the status is changing from not-verified to verified
    {
   //   user.is_docs_verify = "verified";
   let fn = user.first_name;
   let mn = user.middle_name;
   let ln = user.last_name;
   let em = user.email;
     //admin1 email
     {
       try {
         // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
         const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail',{
           // Include any data you want to send in the request body
           // For example, you might want to send user data
           process:" un-verified by Admin,Docs Missing" , fn:fn,ln:ln,mn:mn,em:em
         });
         // Check if the response indicates success (adjust the condition based on your API response)
         if (response.status === 200) {
           console.log('submit now  to  admin1  on  verification');
           // Do something with the response data if needed
           // For example, you can access it using response.data
         } else {
           // Handle unexpected response status
           console.error('Unexpected HTTP response status:', response.status);
         }
       } catch (error) {
         // Handle network errors, request timeouts, or any other errors
         console.error('Error making HTTP POST request:', error.message);
       }
     }
     //admin1 email
     {
      try {
        // Make an HTTP POST request to https://app.setczone.com/api/user/sendEmail
        const response = await axios.post('https://app.setczone.com/api/user/sendemailoffice',{
          // Include any data you want to send in the request body
   user, value :"have been marked as In-eligible",subject:"Lead Un-Verified"
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('send  email to  office  on  verification');
          // Do something with the response data if needed
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
   }
      // Save the updated user
      await user.save();
    }
    return { user: user };
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const updateDocumentStatus = async (userId) => {
  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    
    let fn = user.first_name;
    let ln = user.last_name;
    let mn = user.middle_name;
    let em = user.email;

 if (user.process_2 !== "1") {
  try {
    // Make an HTTP POST request to send user email
    const userResponse = await axios.post('https://app.setczone.com/api/user/sendemailOnNinteenstep2', {
      user
    });

    if (userResponse.status === 200) {
      console.log('User email sent');
    } else {
      console.error('Unexpected HTTP response status:', userResponse.status);
    }
  } catch (error) {
    console.error('Error making HTTP POST request:', error.message);
  }

  try {
    // Make an HTTP POST request to send admin1 email
    const admin1Response = await axios.post('https://app.setczone.com/api/user/sendprocessemail', {
      process: "Submit Now",
      fn: fn,
      ln: ln,
      em: em,
      mn: mn
    });

    if (admin1Response.status === 200) {
      console.log('Admin1 email sent');
    } else {
      console.error('Unexpected HTTP response status:', admin1Response.status);
    }
  } catch (error) {
    console.error('Error making HTTP POST request:', error.message);
  }

  try {
    // Make an HTTP POST request to send admin1 new email
    const admin1NewResponse = await axios.post('https://app.setczone.com/api/user/setczoneadmin', {
      process: "submit now",
      fn: fn,
      ln: ln,
      mn: mn,
      em: em
    });

    if (admin1NewResponse.status === 200) {
      console.log('Admin1 new email sent');
    } else {
      console.error('Unexpected HTTP response status:', admin1NewResponse.status);
    }
  } catch (error) {
    console.error('Error making HTTP POST request:', error.message);
  }

  try {
    // Make an HTTP POST request to send email to admin
    const adminEmailResponse = await axios.post('https://app.setczone.com/api/user/sendEmail', {
      user
    });

    if (adminEmailResponse.status === 200) {
      console.log('Admin email sent');
    } else {
      console.error('Unexpected HTTP response status:', adminEmailResponse.status);
    }
  } catch (error) {
    console.error('Error making HTTP POST request:', error.message);
  }
}
if (user.oldDatesformat =="updated") {
  //email admin1 for update dates  
  try {
    // Make an HTTP POST request to http://localhost:5000/user/sendEmail
    const response = await axios.post('https://app.setczone.com/api/user/sendprocessemail', {
      // Include any data you want to send in the request body
      // For example, you might want to send user data
      process: "New Version Calendar",
      fn: fn,
      ln: ln,
      mn: mn,
      em: em
    });
    // Check if the response indicates success (adjust the condition based on your API response)
    if (response.status === 200) {
        user.calendar_updation_notification=true
      console.log('HTTP POST request to https://app.setczone.com/api/user/sendprocessemail successful');
      // Do something with the response data if needed
      // For example, you can access it using response.data
    } else {
      // Handle unexpected response status
      console.error('Unexpected HTTP response status:', response.status);
    }
  } catch (error) {
    // Handle network errors, request timeouts, or any other errors
    console.error('Error making HTTP POST request:', error.message);
  }
   // send  email  to  admin
   {
    console.log("user", user);
  
    try {
      // Make an HTTP POST request to http://localhost:5000/user/sendEmail
      const response = await axios.post('https://app.setczone.com/api/user/sendEmail',{
        // Include any data you want to send in the request body
        // For example, you might want to send user data
        user
      });
      // Check if the response indicates success (adjust the condition based on your API response)
      if (response.status === 200) {
        console.log('HTTP POST request to https://app.setczone.com/api/user/sendEmail successful');
        // Do something with the response data if needed
        // For example, you can access it using response.data
        user.notify="yes";
user.save();
      } else {
        // Handle unexpected response status
        console.error('Unexpected HTTP response status:', response.status);
      }
    } catch (error) {
      // Handle network errors, request timeouts, or any other errors
      console.error('Error making HTTP POST request:', error.message);
    }
  } 

}
  
    // Update the application status
    user.applicationWithDocument = true;
    user.process_2=true;
    // Save the updated user
    await user.save();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const updateCalculator = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    const user = await User.findByPk(id);
    if (!user) {
      return { error: 'User not found' };
    }
  
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          // Check if the field is an array and already exists
          if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
            // Append a digit to the new file names to make them unique
            const uniqueNames = updateData[key].map((newName) => {
              let index = 1;
              let tempName = newName;
              // Iterate until a unique name is found
              while (user[key].includes(tempName)) {
                index += 1;
                const nameParts = newName.split('.');
                // Insert the index before the file extension
                tempName = `${nameParts[0]}_${index}.${nameParts[1]}`;
              }
              return tempName;
            });
            // If yes, append new values to the existing array
            user[key] = user[key].concat(uniqueNames);
          } else {
            // Otherwise, update the field with the new value
            user[key] = updateData[key];
          }
        }
      }
    // Save the changes to the database
    await user.save();
    return { status: 200, message: "Application  Submiited  succesfully", user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle specific error cases
    if (error.message === 'User not found') {
      return { status: 404, error: 'User not found' };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};

const sendEmail = async (req, res) => {
  

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.EMAIL_PASSWORD 
      }
  })
  let info = await transporter.sendMail({
      from: 'afaq58681@gmail.com',
      to: 'hafiznizaqatali@gmail.com', // list of receivers
      text: 'uogiiiiiiiisssssssssssss',
  })
  if (info.messageId) {
      console.log(info, 84)
      if (info.messageId) {
        console.log(info, 84);
   res.status(200).json({ code: 200, message: 'Email  has  been  sent  successfully'});
      } else {
        res.status(500).json({ code: 500, message: 'Server error' });
      }
    } 
}

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  notverfication,
  getUserWithMail,
  updateUser ,
  submitOtp ,
  deleteUser,
  uploadForm,
 updateApplication,
 getAllFiles,
 updateDocumentStatus,
 updateCalculator,
 getById,
 verfication,
 uploadFormPreSignatureFileUpload
};
