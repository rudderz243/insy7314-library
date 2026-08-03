// here we import express, which allows us to create an instance of the API and web server
const express = require("express");
// cors - resource sharing library - we use it to tell our backend which frontends may talk to it
const cors = require("cors");

// here, we call in the database middleware, which allows us to access the methods we've created to interact with the database
const database = require("./middleware/dbMiddleware.js");

// here, we call in all of our routing files, allowing us to map them later on in the file
const homeRoutes = require("./routes/homeRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

// the first step in creating the API, is to create a singleton (single instance) of the express library to call in throughout the whole app
const app = express();

// then, you need to tell the app to make use of any required middleware you need to complete and understand the requests
app.use(express.json()); // express.json allows us to use json in requests and responses
// cors allows us to let our frontend talk to the backend by whitelisting its URL
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// then, you need to map the routes to specific endpoints, so that the user/client is able to access them
app.use("/api/home", homeRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// lastly, we tell the application to start listening. we need to specify a port for the app to listen on, in this case, 3000
// we do this using a then function. it does something first (in this case, connects to the database), THEN starts the listening for connections
database.start().then(() => {
  app.listen(3000, () => {
    // once the app starts, we print out to the developer terminal
    console.log("API started on port 3000");
  });
});
