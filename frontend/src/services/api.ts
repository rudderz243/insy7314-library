import type { Book } from "../models/book.ts";

const API_URL = "https://localhost:3000/api";

// this function will get ALL books from the API
export async function getBooks(): Promise<Book[]> {
  // fetch(http://localhost:3000/api/books)
  const response = await fetch(`${API_URL}/books`);
  return response.json();
}

// this function will get a SINGLE book based on ID
export async function getBook(id: string): Promise<Book> {
  // fetch(http://localhost:3000/api/books/abc123)
  const response = await fetch(`${API_URL}/books/${id}`);
  return response.json();
}

// this function will CREATE a new book using a POST request
export async function createBook(book: Book): Promise<Book> {
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
}

// this function will update sections of an existing Book in the database using PATCH
export async function updateBook(book: Book, id: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
}

// this function will replace an entire book in the database using PUT
export async function replaceBook(book: Book, id: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
}

// this function will delete a book from the database using a DELETE request
export async function deleteBook(id: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
