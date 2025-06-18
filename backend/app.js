// const express = require('express');
// const app = express();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const path = require('path');

// const errorMiddleware = require('./middlewares/error');

// app.use(
//    cors({
//       origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//       credentials: true,
//    })
// );
// app.use(function (req, res, next) {
//    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//    res.header('Access-Control-Allow-Headers', true);
//    res.header('Access-Control-Allow-Credentials', true);
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//    next();
// });
// app.use(express.json()); //instead of body-parser
// app.use(cookieParser());
// console.log(process.env.NODE_ENV);
// //document uplaod
// const upload = require('./middlewares/upload');
// const catchAsyncError = require('./middlewares/catchAsyncErrors');

// app.post(
//    '/api/upload',
//    upload.single('image'),
//    catchAsyncError(async (req, res, next) => {
//       res.json({ file: req.file.path });
//    })
// );

// //Importing routes
// const users = require('./routes/user');
// const routes = require('./routes/election');

// app.use('/api/election', users);
// app.use('/api/election', routes);

// if (process.env.NODE_ENV == 'production') {
//    app.use(express.static(path.join(__dirname, '../frontend/build'))) /
//       app.get('*', (req, res) =>
//          res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
//       );
// }

// //Middleware to handle errors
// app.use(errorMiddleware);

// module.exports = app;
const User = require("./models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

//Access -> Admin
//Route -> /api/election/register
//Description -> Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, eAddress } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "No email provided",
    });
  }

  const user = await User.create({
    name,
    email,
    eAddress,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//Access -> Everyone
//Route -> api/election/getUser
//Description -> Getting one user
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Access -> Everyone
//Route -> /api/election/generateOtp
//Description -> Generating OTP to login
exports.generateOTP = catchAsyncError(async (req, res, next) => {
  console.log("generateOTP: Request received", req.body);
  const { email } = req.body;
  if (!email) {
    console.log("generateOTP: No email provided");
    return res.status(400).json({
      success: false,
      message: "No email provided",
    });
  }

  try {
    console.log("generateOTP: Finding user with email", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("generateOTP: User not found");
      return next(new ErrorHandler("Invalid Email", 404));
    }

    console.log("generateOTP: Generating OTP for user", user._id);
    const otp = user.getOtp();
    console.log("generateOTP: OTP generated", otp);

    console.log("generateOTP: Saving user with OTP");
    await user.save({ validateBeforeSave: false });
    console.log("generateOTP: User saved successfully");

    console.log(`Generated OTP for ${user.email}: ${otp} (expires in 5 minutes)`);

    console.log("generateOTP: Sending success response");
    return res.status(200).json({
      success: true,
      message: `OTP generated and logged for ${user.email}`,
    });
  } catch (error) {
    console.error("generateOTP: Error occurred", error.message, error.stack);
    if (user) {
      console.log("generateOTP: Clearing OTP due to error");
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false }).catch(saveErr => {
        console.error("generateOTP: Failed to clear OTP", saveErr.message, saveErr.stack);
      });
    }
    return next(new ErrorHandler(`Failed to generate OTP: ${error.message}`, 500));
  }
});

//Login a user
//Access -> everyone
// api/election/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter email and OTP", 400));
  }

  const user = await User.findOne({
    email,
    otpExpire: { $gt: Date.now() },
  }).select("+otp");

  if (!user) {
    return next(
      new ErrorHandler("OTP is invalid, expired, or email is incorrect", 400)
    );
  }

  const isOtpMatched = await user.compareOtp(otp);
  if (!isOtpMatched) {
    return next(new ErrorHandler("Invalid Email or OTP", 401));
  }
  user.otp = null;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
});

//Logout a user
//Access -> allusers
// api/election/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//Get all users
//Access -> admin
// api/election/allUsers
exports.allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Vote a candidate
//Access -> allusers
// api/election/vote
exports.vote = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const newUserData = {
    hasVoted: true,
  };

  const user = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Delete a user
//Access -> admin
//api/election/delete/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with id ${req.params.id}`, 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});

//Edit user details
//Access -> user
//api/election/edit
exports.editUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const { name, eAddress } = req.body;

  const newUserData = {
    name,
    eAddress,
  };
  const user = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
