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

const router = express.Router();

router.post("/", createBook);

router.get("/", getAllBooks);
router.get("/:id", getBook);

router.put("/:id", replaceBook);
router.patch("/:id", updateBook);

router.delete("/:id", deleteBook);

module.exports = router;
