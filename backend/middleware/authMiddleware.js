const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// validate the user authentication token
const validateAuth = async (req, res, next) => {
  let token;

  // checks for the presence of the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // try and find the user associated with that token
      req.user = await User.findById(decoded.id).select("-password");
      // check whether a user was found using that token
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Requesting user no longer exists" });
      }
      // continuing from here
      return next();
    } catch (error) {
      // if we fail to decode their token, we return a 401
      // this is called a FAIL-CLOSE state. if something fails, we want to prevent auth, rather than just
      // let them through
      return res
        .status(401)
        .json({ message: "Not authorized, failed to validate token." });
    }
  }
  // if no token is provided, we return a 401 - not authorized
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }
};
// alongside validating that a correct token is provided, we need to check if the provided token has the permission to
// do what it wants to do
const validateRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: you do not have permission to do this." });
    }
    // once we've validated the role, next() passes the incoming request to the next piece of middleware
    next();
  };
};

module.exports = { validateAuth, validateRole };
