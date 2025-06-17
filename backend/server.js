const express = require("express");
const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const path = require("path");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Server is being shutdown due to uncaught exception");
  process.exit(1);
});

// Setting up config file
dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDB();

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// // Handle all non-API routes with React’s index.html (for React Router)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// Start server with Render-compatible port binding
const server = app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server started on Port: ${process.env.PORT}`);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is being shutdown due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
