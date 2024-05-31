const { sendLoginOtp, loginByOtp } = require("../services/auth/login");
const { registerUser } = require("../services/auth/register");
const { generateOtp } = require("../services/auth/sandbox");

const test = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "API Works Fine",
  });
};

const regsiter = (req, res) => {
  const body = req.body;
  registerUser(body)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: "0",
          message: "Created user not found, something went wrong",
        });
      }

      return res.status(200).json({
        status: "0",
        message: "User Registered",
        data: user,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({
        status: "0",
        message: error.message,
      });
    });
};

const sendAadharOtp = (req, res) => {
  const { aadhaar_number } = req.body;
  generateOtp(aadhaar_number)
    .then((response) => {
      if (response) {
        console.log(response);
        const data = response.data;
        const msg = data.message;
        if (data.reference_id) {
          return res.status(200).json({
            status: "1",
            message: msg,
            data: {
              reference_id: data.reference_id,
            },
          });
        }

        return res.status(200).json({
          status: "0",
          message: msg,
        });
      }
    })
    .catch((error) => {
      return res.status(401).json({
        status: "0",
        message: error.message || "Invalid response, something went wrong",
      });
    });
};

const loginOtp = (req, res) => {
  const { number } = req.body; // Fixed typo in variable name

  sendLoginOtp(number)
    .then((response) => {
      if (response.Status !== "Success") {
        // Handle specific API errors, not just 404
        return res.status(400).json({
          status: "0",
          message: "Failed to send OTP. Please try again.",
        });
      }
      return res.status(200).json({
        status: "1",
        message: "OTP sent successfully.",
      });
    })
    .catch((error) => {
      console.error("Error sending OTP:", error.message); // Log the error

      // Always send an error response in the catch block
      return res.status(500).json({
        status: "0",
        error: "Internal server error. Failed to send OTP.",
        message: error.message
      });
    });
};

const loginVerifyOtp = (req, res) => {
    const {number, otp} = req.body
    loginByOtp(number, otp).then( user => {
        return res.status(200).json({
            status: "1",
            data:user
        })
    }).catch( error => {
        console.log('Error verifying OTP and logging in:', error);
        if (error.message === "Invalid OTP") {
            return res.status(400).json({ 
                status:"0",
                message:error.message
             });
        }
        if (error.message === "User not found") {
            return res.status(404).json({ 
                status:"0",
                message:error.message
             });
        }
        return res.status(500).json({ 
            status:"0",
            message: error.message,
            error: 'Internal server error' 
        });
    })

}

module.exports = { test, regsiter, sendAadharOtp, loginOtp, loginVerifyOtp };
