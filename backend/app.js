// const express = require('express');
// const app = express();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const path = require('path');

// const errorMiddleware = require('./middlewares/error');

// // app.use(
// //    cors({
// //       origin: ['http://localhost:3000', 'http://127.0.0.1:3000','https://voting-frontend.netlify.app'],
// //       credentials: true,
// //    })
// // );
// // app.use(function (req, res, next) {
// //    res.header('Access-Control-Allow-Origin', 'http://localhost:3000','https://voting-frontend.netlify.app');
// //    res.header('Access-Control-Allow-Headers', true);
// //    res.header('Access-Control-Allow-Credentials', true);
// //    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// //    next();
// // });
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       callback(null, origin); // allow all origins dynamically
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
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
// app.get('/', (req, res) => {
//   res.send('API is running 🚀');
// });

// app.use('/api/election', users);
// app.use('/api/election', routes);

// // if (process.env.NODE_ENV == 'production') {
// //    app.use(express.static(path.join(__dirname, '../frontend/build'))) /
// //       app.get('*', (req, res) =>
// //          res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
// //       );
// // }

// //Middleware to handle errors
// app.use(errorMiddleware);

// module.exports = app;

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({ path: "./config.env" });

const errorMiddleware = require("./middlewares/error");

// Configure CORS
const allowedOrigins = [
  "https://voting-frontend.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.error("CORS error: Origin not allowed:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

console.log("NODE_ENV:", process.env.NODE_ENV);

// Document upload
const upload = require("./middlewares/upload");
const catchAsyncError = require("./middlewares/catchAsyncErrors");

app.post(
  "/api/upload",
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    res.json({ file: req.file.path });
  })
);

// Importing routes
const routes = require("./routes/election");
const users = require("./routes/user");

app.use("/api/election", routes);
app.use("/api/election", users);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
