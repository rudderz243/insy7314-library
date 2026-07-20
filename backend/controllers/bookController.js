// when we want to perform database operations in our controller, we import the model, as it has built in methods to validate,
// and perform all CRUD operations on the actual database
const Book = require("../models/bookModel.js");

// C - Create
// when dealing with create, we can expect a POST request, as well as all the required information for an object we want to make
const createBook = async (req, res) => {
  try {
    // check if everything is there
    const { title, author, publishedYear, isbn, genre } = req.body;

    // if it's not there, 400
    if (!title || !author || !publishedYear || !isbn || !genre) {
      return res
        .status(400)
        .json({ message: "Please ensure all required fields are present." });
    }
    // use the model to perform the required operation
    const book = Book.create(req.body);
    // return the book object as json (code 201 - object created)
    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// R - Read (read ALL objects)
// reading doesn't require the user to pass through any parameters, so the body will be empty
const getAllBooks = async (req, res) => {
  try {
    // use th emodel to perform the required operation
    const books = await Book.Find();
    // convert the array of books, to a json array, and send to user
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// R - Read (read ONE object)
// to get a specific book, we are required to pass through an ID, but in this case, we don't use the body
// get requests don't allow for a body - so we use parameters
const getBook = async (req, res) => {
  try {
    // check if the required parameter exists, or if it is blank
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "An ID is required in order to get a book." });
    }
    // perform the required operation using the model
    const book = await Book.findById(req.params.id);
    // if a book cannot be found using that ID (e.g., the ID is invalid, or just doesn't exist in the DB), return a 404
    if (!book) {
      return res.status(404).json({
        message: "A book with that ID does not exist in the collection.",
      });
    }
    // if the book IS found, return the book
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// U - Update (Partial Update, not changing entire book, but some aspects)
// this type of request is a PATCH request, as we are only "patching up" the existing book by changing some parameters
const updateBook = async (req, res) => {
  try {
    // we make use of the parameters again, because the body will be used for the updated book information
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "An ID is required in order to get a book." });
    }
    // here, we check if any updated information is actually present in the body.
    // the model performs validation for us in this scenario, so we don't have to validate the presence of anything
    if (req.body.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide information to update the book" });
    }
    // here, we use the model to perform the required operation
    // we pass the ID of the book we want to update, the updated information, and some options
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if the book we want to update can't be found
    if (!book) {
      return res
        .status(404)
        .json({ message: "No book matching that ID in the collection" });
    }
    // return the updated book
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// U - Update (replace a book with an updated one)
// this makes use of a PUT request. in this scenario, we're putting an entirely new book in the place of the previous one
const replaceBook = async (req, res) => {
  try {
    // parameter to get the ID
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "An ID is required in order to get a book." });
    }
    // body for the updated information
    if (req.body.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide information to update the book" });
    }
    // using the model to perform ther equired operation
    // once again, we do not need to perform validation for this operation, as the model handles that for us
    const book = await Book.findOneAndReplace(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if the book can't be found
    if (!book) {
      return res
        .status(404)
        .json({ message: "No book matching that ID in the collection" });
    }
    // otherwise, return the updated book
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// D - Delete
// this would be paired with a DELETE request
const deleteBook = async (req, res) => {
  try {
    // parameter for the ID
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "An ID is required in order to get a book." });
    }
    // use the model to perform the required operation
    const book = await Book.findByIdAndDelete(req.params.id);
    // if book wasn't found
    if (!book) {
      return res
        .status(404)
        .json({ message: "No book matching that ID in the collection" });
    }
    // otherwise, return the deleted book
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Server explod" });
  }
};

// export all the methods to make them "public" (accessible in other files)
module.exports = {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  replaceBook,
  deleteBook,
};
