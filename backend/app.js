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
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorMiddleware = require('./middlewares/error');

// CORS configuration: Allow frontend origins
// // Handle preflight requests
// app.options('*', cors());

// // Allow all origins dynamically while supporting credentials
// app.use(
//   cors({
//     origin: true, // Reflect the request origin
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Configure CORS
const allowedOrigins = [
  "https://voting-frontend.netlify.app",
  "http://localhost:3000", // For local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/election", require("./routes/electionRoutes")); // Adjust path as needed

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Parse JSON bodies and cookies
app.use(express.json()); // Replaces body-parser
app.use(cookieParser());

// Log environment for debugging
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// File upload middleware
const upload = require('./middlewares/upload');
const catchAsyncError = require('./middlewares/catchAsyncErrors');

app.post(
  '/api/upload',
  upload.single('image'),
  catchAsyncError(async (req, res, next) => {
    res.json({ file: req.file.path });
  })
);
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});


// Import routes
const users = require('./routes/user');
const election = require('./routes/election');

// Use routes
app.use('/api/election', users);
app.use('/api/election', election);

// // Serve frontend static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
//   );
// }

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
