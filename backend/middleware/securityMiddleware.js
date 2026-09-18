const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("../utils/logger.js");

// cors -> limits WHO and WHAT can communicate with our backend
const corsOptions = {
  origin: "https://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

// helmet -> general purpose security library that is highly configurable
const helmetOptions = {
  // CSP -> helps with preventing XSS (cross site scripting), and data injection
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline allows for styling frameworks
      imgSrc: ["'self'", "data:", "blob:"], // embedded images only
      connectSrc: [
        "'self'",
        "https://localhost:3000",
        "https://localhost:5173",
      ],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"], // blocks stuff we won't use like Flash and JavaWebApp
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"], // disallow embedding of other hidden pages
    },
  },
  // COEP -> cross origin embedding policy. this allows us to allow/disallow embedding
  crossOriginEmbedderPolicy: false,
  // COOP -> cross origin opener policy. this allows us to restrict other tabs or browser windows
  // from accessing our context
  crossOriginOpenerPolicy: { policy: "same-origin" },
  // dns prefetch control -> disables proactive dns requesting in browser (to prevent dns leakage)
  dnsPrefetchControl: { allow: false },
  // frameguard -> this prevents clickjacking by setting X-Frame-Options to DENY, preventting embedding of our
  // website and API in <iframe>s
  frameguard: { action: "deny" },
  // hidePoweredBy -> this hides the fact we are using express for our API (security through obscurity)
  hidePoweredBy: true,
  // HSTS -> http strict transport security. tell browsers that HTTP is not an allowed way of communicating with the API
  hsts: {
    maxAge: 15552000, // 180 days converted to seconds
    includeSubDomains: true, // if our domain was hustlehub.com, INCLUDE api.hustlehub.com etc.
    preload: true,
  },
  // ieNoOpen -> prevent internet explorer
  ieNoOpen: true,
  // no sniff -> prevents MIME-type sniffing (like hiding javascript in an image file and executing it)
  noSniff: true,
  // originAgentCluster -> tells the browser to isolate our app from the rest of the OS (to prevent cookie stealing)
  originAgentCluster: true,
  // referrer policy -> how much information we share when navigating AWAY from our site
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // xssFilter -> replaces the browser XSS options with our own ones
  xssFilter: false,
};

// general rate limiter -> apply limiting to all of the routes our API exposes
// this helps against DOS attacks, and helps prevent scraping by bots and AI scrapers
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // sets up a 15 minute window that we track
  limit: 150,
  standardHeaders: "draft-8", // in the response headers, return how much of the limit remains
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP address. Pls calm down and come back in 15 minutes.",
  },
  handler: (req, res, next, options) => {
    // log the limit as reached
    logger.warn(`Rate limit (general) exceeded by ${req.ip}`, "RATE_LIMIT");
    // return the response to the user informing them of the limit
    res.status(options.statusCode).json(options.message);
  },
});

// auth rate limiter -> stricter limits on login/registration routes
// this helps against brute-forcing attacks, and credential stuffing attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10, // lower limit compared to the general purpose limiter
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP address. Pls calm down and come back in 15 minutes.",
  },
  handler: (req, res, next, options) => {
    // log the limit as reached
    logger.warn(`Rate limit (auth) exceeded by ${req.ip}`, "RATE_LIMIT");
    // return the response to the user informing them of the limit
    res.status(options.statusCode).json(options.message);
  },
});

// mongo sanitize -> runs sanitization on any inputs passed through from the user to prevent NoSQL injection
const mongoSanitizer = mongoSanitize({
  replaceWith: "_", // replace any bad characters, like $, with this
  onSanitize: ({ req, key }) => {
    logger.warn(
      `NoSQL escape attempted using key ${key} from ${req.ip}`,
      "SECURITY",
    );
  },
});

// this function will handle enabling all security middleware for our app
const setupSecurity = (app) => {
  // 1st, helmet
  app.use(helmet(helmetOptions));
  // 2nd, cors
  app.use(cors(corsOptions));
  // 3rd, nosql injection
  // temporairaly disabled due to version mismatching
  //app.use(mongoSanitizer);
  // 4th, apply general rate limits
  app.use("/api", generalLimiter);
  // 5th, auth limits
  app.use("/api/auth", authLimiter);
};

module.exports = setupSecurity;
