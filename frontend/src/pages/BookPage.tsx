import React, { useState, useEffect } from "react";
import type { Book } from "../models/book.ts";
import {
  getBooks,
  getBook,
  replaceBook,
  updateBook,
  createBook,
  deleteBook,
} from "../services/api.ts";
import { replace } from "react-router-dom";

export const BookPage: React.FC = () => {
  // create a book array to hold all the books
  const [books, setBooks] = useState<Book[]>([]);
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // local variables to store information from the textboxes
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [genre, setGenre] = useState<"Fiction" | "Non-Fiction" | "Textbook">(
    "Fiction",
  );

  // create a helper function to use our API service and update the book array
  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch {
      setBooks([]);
    }
  };

  // useEffect runs every time a component updates on the page
  // this includes the page loading, a button being pressed, or anything else that updates
  // the current state of the page
  useEffect(() => {
    loadBooks();
  }, []);

  // helper function to reset the input/editing form
  const resetForm = () => {
    setEditingID(null);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setPublishedYear("");
    setGenre("Fiction");
  };

  // create a method to handle the form submission (creation of a new book)
  const handleSubmit = async (e: React.FormEvent) => {
    // this prevents the form from submitting as soon as the page loads
    // we do not want blank books in the database
    e.preventDefault();

    const bookData: Book = {
      title,
      author,
      isbn,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      genre,
    };

    // also need to be able to handle editing/updating/replacing a book
    if (editingID) {
      // if a book has been selected to be replaced, we replace that book
      await replaceBook(bookData, editingID);
    } else {
      // otherwise, we simply create a new book if we are not editing
      await createBook(bookData);
    }
    // reset the form for the next submission
    resetForm();
    // and fetch the updated array of books
    loadBooks();
  };

  // patch updates an exiting book
  const handlePatch = async () => {
    // check whether a book has actually been selected to edit
    if (!editingID) return;
    // based on what has changed, pass through the appropriate values to the function
    await updateBook(
      {
        title,
        author,
        isbn,
        publishedYear: publishedYear ? Number(publishedYear) : undefined,
        genre,
      },
      editingID,
    );
    // once editing is complete, clear the form for the next submission
    resetForm();
    // and reload the book array to have the updated information
    loadBooks();
  };

  const handleDelete = async (id: string) => {
    // call teh delete function from our API helper file
    await deleteBook(id);
    // clear the currently selected book, so the user can select a new one
    if (editingBook?._id === id) setEditingBook(null);
    // reload books list
    loadBooks();
  };

  // this helper method loads in book information for a book we want to edit/delete
  const handleInspect = async (id: string) => {
    const data = await getBook(id);
    setEditingBook(data);
  };
  // where return starts = the actual HTML/display area
  return (
    <div className='bento-grid'>
      {/* the below div will hold the main card, which will hold our other controls */}
      <div className='bento-card bento-col-8 teal-header'>
        <h3 className='card-title'>
          <span>{editingID ? "Edit Book" : "Add New Book"}</span>
          {editingID && (
            <button className='btn btn-outline btn-sm' onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </h3>
        {/* below the heading - we have the input form for editing/adding a new book */}
        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-group'>
              <label>Title:</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label>Author:</label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group'>
              <label>ISBN:</label>
              <input
                type='text'
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label>Published Year:</label>
              <input
                type='number'
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label>Genre:</label>
              {/* select = dropdownlist in web */}
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as any)}
              >
                <option value={"Fiction"}>Fiction</option>
                <option value={"Non-Fiction"}>Non-Fiction</option>
                <option value={"Textbook"}>Textbook</option>
              </select>
            </div>
          </div>
          {/* after the inputs, we need the buttons to save */}
          <div className='btn-group' style={{ marginTop: "10px" }}>
            <button type='submit' className='btn btn-teal'>
              {editingID ? "Replace Book" : "Add Book"}{" "}
              {/* if editing: put else post */}
            </button>
            <button className='btn btn-teal' onClick={handlePatch}>
              Update Book
            </button>
          </div>
        </form>
      </div>{" "}
      {/* end of the first card */}
      {/* the next card holds stats */}
      <div
        className='bento-card bento-col-4'
        style={{ borderLeft: "5px solid #0d9448" }}
      >
        <h3 className='card-title'>Stats</h3>
        <div style={{ marginTop: "15px" }}>
          <div className='stats-num'>{books.length}</div>
          <div className='stats-label'>Total Books</div>
        </div>
      </div>
      {/* book details card */}
      {editingBook && (
        <div
          className='bento-card bento-col-12'
          style={{ borderLeft: "5px solid #0d9448" }}
        >
          <h3 className='card-title'>
            Book Details
            <button
              className='btn btn-outline btn-sm'
              onClick={() => setEditingBook(null)}
            >
              Close Pane
            </button>
          </h3>
          <p>ID: {editingBook._id}</p>
          <p>Title: {editingBook.title}</p>
          <p>Author: {editingBook.author}</p>
          <p>ISBN: {editingBook.isbn}</p>
          <p>Genre: {editingBook.genre}</p>
          {editingBook && <p>Year: {editingBook.publishedYear}</p>}
        </div>
      )}
      {/* list of all books card */}
      <div className='bento-card bento-col-12 teal-header'>
        <h3 className='card-title'>
          <span>Book List</span>
          <button className='btn btn-outline btn-sm' onClick={loadBooks}>
            Refresh
          </button>
        </h3>
        {/* we hide this if there are no books */}
        {books.length === 0 ? (
          <p style={{ color: "#64748b" }}>No books available.</p>
        ) : (
          books.map((book) => (
            <div key={book._id || book.isbn} className='book-item'>
              <div className='book-info'>
                <h4>
                  {book.title}{" "}
                  <span className='badge badge-teal'>{book.genre}</span>
                </h4>
                <p>
                  By {book.author} | ISBN: {book.isbn}{" "}
                  {book.publishedYear && `| Year: ${book.publishedYear}`}
                </p>
              </div>
              {/* these buttons will appear next to each item in the list */}
              <div className='btn-group'>
                {book._id && (
                  <button
                    className='btn btn-outline btn-sm'
                    onClick={() => handleInspect(book._id!)}
                  >
                    Inspect Book
                  </button>
                )}
                {book._id && (
                  <button
                    className='btn btn-outline btn-sm'
                    onClick={() => handleDelete(book._id!)}
                  >
                    Delete Book
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
