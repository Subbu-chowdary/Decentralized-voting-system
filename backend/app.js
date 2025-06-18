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

// Define allowed origins
const allowedOrigins = [
  'https://voting-frontend.netlify.app', // Frontend origin
  'http://localhost:3000', // For local development (adjust port as needed)
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON bodies and cookies
app.use(express.json());
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

// Root route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Import routes
const users = require('./routes/user');
const election = require('./routes/election');

// Use routes
app.use('/api/election', users);
app.use('/api/election', election);

// // Serve frontend static files in production (uncomment if needed)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
//   );
// }

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
