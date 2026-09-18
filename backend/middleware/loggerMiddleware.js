const logger = require("../utils/logger.js");

// this file will intercept each and every request coming in (because it is middleware), and write the appropriate log
// based on what the response code was (200, 400, 500, etc),

const httpLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    // getting information about the HTTP request we are logging
    const { statusCode } = res;
    const method = req.method;
    const url = req.originalUrl || req.url; // what endpoint was hit?
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"; // WHO sent the request?

    // next -> if the user is logged in, log WHO made the request
    const userTag = req.user ? ` [User: ${req.user.username}]` : "";
    // craft the message
    const logMessage = `${method} ${url} ${statusCode} (${duration}ms) - IP: ${ip}${userTag}`;

    // based on status code -> do the appropriate log function
    if (statusCode >= 500) {
      logger.error(logMessage, "HTTP");
    } else if (statusCode >= 400) {
      logger.warn(logMessage, "HTTP");
    } else {
      logger.info(logMessage, "HTTP");
    }
  });
  // once we are done logging -> pass the request on to the next middleware item
  next();
};

module.exports = httpLogger;
