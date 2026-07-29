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
};
