const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const logger = require("../utils/logger.js");
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
      req.user = await User.findById(decode.id).select("-password");
      // check whether a user was found using that token
      if (!req.user) {
        logger.warn(
          `Auth failure: Attemped login for non-existing user. (${req.method} ${req.originalUrl})`,
          "SECURITY",
        );
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
      logger.warn(
        `Auth failure: Invalid or expired token present. (${req.method} ${req.originalUrl})`,
        "SECURITY",
      );
      return res
        .status(401)
        .json({ message: "Not authorized, failed to validate token." });
    }
  }
  // if no token is provided, we return a 401 - not authorized
  if (!token) {
    logger.warn(
      `Auth rejected: Attemped access of route with no token. (${req.method} ${req.originalUrl})`,
      "SECURITY",
    );
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
      logger.warn(
        `Auth forbidden: ${req.user.username} attempted to access something they shouldn't. (${req.method} ${req.originalUrl})`,
        "SECURITY",
      );
      return res
        .status(403)
        .json({ message: "Forbidden: you do not have permission to do this." });
    }
    // once we've validated the role, next() passes the incoming request to the next piece of middleware
    next();
  };
};

module.exports = { validateAuth, validateRole };
