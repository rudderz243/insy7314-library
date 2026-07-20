// import express (the API package)
const express = require("express");

// in your routes file, you need to call in the controller it is related to, as well as all of its functions
const {
  healthCheck,
  greet,
  message,
} = require("../controllers/homeController.js");

// then, you need to set up a router, to handle a link between the endpoint and the correct function in the controller
const router = express.Router();

// each request requires a method, path, and a corresponding function in the controller
// for this request, we define the following:
// method - get request (the user doesn't need to pass data for this request)
// path - what URL we need to go to to trigger this request
// function - we say that when this request is triggered, run the healthCheck function in the controller
router.get("/healthCheck", healthCheck);

router.post("/greet", greet);

router.post("/message", message);

// export all the methods to make them "public" (accessible in other files)
module.exports = router;
