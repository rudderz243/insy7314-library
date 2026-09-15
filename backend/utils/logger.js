// fs + path:
// fs -> filesystem (when we want to interact with files and folders on the computer)
// path -> this is to determine where files/folders are
const fs = require("fs");
const path = require("path");

// declare a constant for where our logs will live
// this command gets the current directory name we are in, and adds /logs to it
const LOGS_DIR = path.join(__dirname, "..", "logs");

// we then check whether the folder already exists or not, creating it if it doesn't
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ANSII colours for logging / terminal output
const colours = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// helper method to return the date in a clean format for the file names of the logs
const getDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  // get the month number (and add 1 as it starts at 0), then add a "0" in front for neatness
  // e.g., Jan would be "0" -> add 1 to make it "1" -> finally add "0" in front to get "01"
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  // return a combination of the date parts
  return `${year}-${month}-${day}`;
};

// helper method to generate the TIMESTAMPS for inside of the log file (when a log occured)
const getTimestamp = () => {
  const now = new Date();
  // use the helper we created to get the yyyy/mm/dd
  const date = getDateString();
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${date} ${hours}:${mins}:${seconds}`;
};

// helper method to add to the end of the log file (rather than overwriting)
const appendToFile = (fileName, logEntry) => {
  // using the name of the file we want to write to, combine it with the name of the log folder
  const filePath = path.join(LOGS_DIR, fileName);
  fs.appendFile(filePath, logEntry, (err) => {
    // if we are not able to add to the log file -> print out to console
    if (err) {
      console.error(
        `[LOGGER ERROR] Failed to write to ${fileName}`,
        err.message,
      );
    }
  });
};

// function to generate the appopriate log message
// level -> how SEVERE? (error, warning, or just standard?)
// message -> what we want to write into the log
// context -> where is the log coming from?
// meta -> any additional metadata (is it from a 3rd party library like mongoose?)
const log = (level, message, context = "APP", meta = null) => {
  // get time and date from our helper methods
  const timestamp = getTimestamp();
  const dateStr = getDateString();

  let metaStr = "";
  // if there IS additional metadata from a 3rd party library -> format it correctly
  if (meta) {
    // if the metadata is an instance of the "Error" class
    if (meta instanceof Error) {
      // extract its content
      metaStr = `\n${meta.stack || meta.message}`;
      // else if the metadata is in the format of a custom object
    } else if (typeof meta === object) {
      // try get its info
      try {
        metaStr = ` ${JSON.stringify(meta)}`;
      } catch (e) {
        metaStr = ` [Unextractable Error]`;
      }
      // if nothing matches -> just gooi the metadata into the string
    } else {
      metaStr = ` ${meta}`;
    }
  }

  // build the string that will go into the log file
  const fileEntry = `[${timestamp}] [${level}] [${context}]: ${message}${metaStr}\n`;

  // gooi into the file
  appendToFile(`${dateStr}-combined.log`, fileEntry);

  // if the level was an error -> add to a seperate file that does not contain general logs
  if (level === "ERROR") {
    appendToFile(`${dateStr}-error.log`, fileEntry);
  }

  // finally -> print any errors to the console so that we don't need to call console.log alongside the logger
  let colour = colours.reset;
  if (level === "INFO") colour = colours.green;
  if (level === "WARN") colour = colours.yellow;
  if (level === "ERROR") colour = colours.red;

  console.log(
    `${colours.gray}[${timestamp}]${colours.reset} ${colour}[${level}]${colours.reset} ${colours.cyan}
    [${context}]${colours.reset}: ${message}${metaStr}`,
  );
};

const logger = {
  info: (message, context = "APP", meta = null) =>
    log("INFO", message, context, meta),
  warn: (message, context = "APP", meta = null) =>
    log("WARN", message, context, meta),
  error: (message, context = "APP", meta = null) =>
    log("ERROR", message, context, meta),
};

module.exports = logger;
