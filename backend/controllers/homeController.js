// no imports for this file, we just make use of existing methods via the singleton we created in app.js

// this is an example GET request, when the user accesses this request, we are not expecting any data
// it simply returns whether the server is running or not, no calculations or complex operations
const healthCheck = async (req, res) => {
  // status code 200 - everything is OK
  return res.status(200).json({ message: "App running!" });
};

// this is an example POST request, when the user accesses this request, we ARE expecting data
// this greets the user using a provided name
const greet = async (req, res) => {
  // the body is what a user or client will pass to the server when making a request, it will contain the data we need to process
  // here, we are looking specifically for a key in the JSON called "name"
  const { name } = req.body;
  // once we've done that, we return the message to a user
  return res.status(200).json({ message: `Hello, ${name}` }); // when calling variables inline, use ` backticks `
};

// this is another example POST request, this time looking at how to appropriately error handle
// this will send a message to a specified recipient
const message = async (req, res) => {
  // the first rule of handling errors, wrap everything in a try {} catch {} block
  try {
    // get our inputs from the body
    const { recipient, message } = req.body;

    // then, the next check we perform is whether the inputs provided are present/blank
    // if an issue is detected with what the user provides us, we return a 400, which means the issue is on the USER side
    if (!recipient || !message) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }
    // once you've checked if the input is blank, you then check whether the input is valid or not
    if (recipient.length > 20) {
      return res.status(400).json({ message: "Please enter a shorter name" });
    }

    if (message.length < 20 || message.length > 200) {
      return res.status(400).json({
        message: "Enter a message longer than 20 characters, but less than 200",
      });
    }
    // if everything checks out, and is valid, we return a 200 OK, along with the expected message
    return res.status(200).json({ message: `${message} sent to ${recipient}` });
  } catch (error) {
    // if something goes wrong on the SERVER side, we return a 500, which means a server error has occured trying to do the request
    res.status(500).json({ message: "An unexpected error occured" });
  }
};

// export all the methods to make them "public" (accessible in other files)
module.exports = {
  healthCheck,
  greet,
  message,
};
