const express = require("express");
const cors = require("cors");

const corsOptions = {
  origin: "https://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

// this function will handle enabling all security middleware for our app
const setupSecurity = (app) => {
  app.use(cors(corsOptions));
};

module.exports = setupSecurity;
