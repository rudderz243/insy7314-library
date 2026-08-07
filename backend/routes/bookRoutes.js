// import express (the API package)
const express = require("express");

// in your routes file, you need to call in the controller it is related to, as well as all of its functions
const {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  replaceBook,
  deleteBook,
} = require("../controllers/bookController.js");

// call in the methods to protect our book routes
const {
  validateAuth,
  validateRole,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", validateAuth, validateRole("librarian"), createBook);

router.get("/", getAllBooks);
router.get("/:id", getBook);

router.put("/:id", validateAuth, validateRole("librarian"), replaceBook);
router.patch("/:id", validateAuth, validateRole("librarian"), updateBook);

router.delete("/:id", validateAuth, validateRole("librarian"), deleteBook);

module.exports = router;
