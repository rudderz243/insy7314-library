// call in the userModel
const User = require("../models/userModel.js");
// jsonwebtoken - this is a special type of token we use to handle our auth persistence
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");

// create a helper function to generate the token based on inputs
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST = registering a new user account on the platform
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please ensure you enter all required information." });
    }
    // does the user already exist?
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn(
        `Registration attempted with duplicate email: ${email}`,
        "AUTH",
      );
      return res
        .status(400)
        .json({ message: "User already exists with that email address." });
    }
    // go ahead and create the user object
    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    // return the newly created user + their token
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, "AUTH", error);
    return res.status(500).json({ message: "Server explod" });
  }
};

// POST - login the user based on their information
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Ensure all required information is present." });
    }
    // check if the user actually exists
    const user = await User.findOne({ email });
    // if no email match -> user does not exist
    if (!user) {
      logger.warn(
        `Login attempted for email not in database: ${email}`,
        "AUTH",
      );
      return res
        .status(400)
        .json({ message: "Supplied information is incorrect" });
    }
    // if the user DOES exist, validate their password
    const isMatch = await user.matchPassword(password);
    // if the password does NOT match -> error
    if (!isMatch) {
      logger.warn(`Incorrect password attempt for ${email}`, "AUTH");
      return res
        .status(400)
        .json({ message: "Supplied information is incorrect" });
    }
    // otherwise, log them in
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, AUTH, error);
    return res.status(500).json({ message: "server sad :(" });
  }
};

module.exports = { registerUser, loginUser };
