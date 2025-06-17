// const mongoose = require("mongoose");
// const validator = require("validator");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"],
//     maxLength: [30, "Your name cannot exceed 30 characters"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     unique: true,
//     validate: [validator.isEmail, "Please enter a valid email address"],
//   },
//   otp: {
//     type: String,
//     select: false,
//   },
//   otpRaw: {
//     // Store raw OTP before hashing (not saved to DB)
//     type: String,
//     select: false,
//   },
//   otpExpire: {
//     type: Date,
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   hasVoted: {
//     type: Boolean,
//     default: false,
//   },
//   eAddress: {
//     type: String,
//     required: [true, "Ethereum account address needed"],
//     unique: true,
//   },
//   electionOngoing: {
//     type: Boolean,
//     default: false,
//   },
// });

// // Encrypt OTP before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("otp")) {
//     return next();
//   }

//   this.otp = await bcrypt.hash(this.otpRaw, 10); // Hash the raw OTP
//   next();
// });

// // Compare user OTP
// userSchema.methods.compareOtp = async function (enteredOtp) {
//   return await bcrypt.compare(enteredOtp, this.otp);
// };

// // Return JWT token
// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE_TIME,
//   });
// };

// // Generate OTP and print it to console
// userSchema.methods.getOtp = function () {
//   // Generate OTP
//   const generatedOtp = crypto.randomBytes(3).toString("hex"); // Shorter OTP

//   this.otpRaw = generatedOtp; // Store raw OTP (not saved in DB)
//   this.otp = generatedOtp; // Save unencrypted OTP before hashing
//   this.otpExpire = Date.now() + 5 * 60 * 1000;

//   // Print OTP in console
//   console.log(`Generated OTP for ${this.email}:`, generatedOtp);

//   return generatedOtp;
// };

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  otp: {
    type: String,
    select: false,
  },
  otpRaw: {
    type: String,
    select: false,
  },
  otpExpire: {
    type: Date,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  eAddress: {
    type: String,
    required: [true, "Ethereum account address needed"],
    unique: true,
  },
  electionOngoing: {
    type: Boolean,
    default: false,
  },
});

// ✅ Always hash the OTP if otpRaw is set
userSchema.pre("save", async function (next) {
  if (this.otpRaw) {
    this.otp = await bcrypt.hash(this.otpRaw, 10);
  }
  next();
});

// ✅ Method to compare entered OTP with hashed OTP
userSchema.methods.compareOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

// ✅ Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// ✅ Generate OTP and store for hashing
userSchema.methods.getOtp = function () {
  const generatedOtp = crypto.randomBytes(3).toString("hex"); // Example: '2f4b7c'
  this.otpRaw = generatedOtp;  // used in pre-save to hash
  this.otp = generatedOtp;     // temporarily set (will be hashed)
  this.otpExpire = Date.now() + 5 * 60 * 1000;

  console.log(`Generated OTP for ${this.email}:`, generatedOtp);
  return generatedOtp;
};

module.exports = mongoose.model("User", userSchema);

