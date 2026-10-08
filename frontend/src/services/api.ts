import type { Book } from "../models/book.ts";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../models/user.ts";

const API_URL = "https://localhost:3000/api";
const TOKEN_KEY = "auth_token";

// helper functions to do with auth
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
// this helper function adds the auth token into the request headers, so that we can auth ourselves
function getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  if (token) {
    headers["Authorization"] = `Bearer: ${token}`;
  }
  return headers;
}
// helper function to deal with server errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`; // this will pull the status code, e.g., 500
    try {
      const data = await response.json();
      if (data && data.message) {
        errorMessage = data.message;
      }
    } catch {
      // this block is empty, if we're not able to read the error message from the response, we leave it as
      // the default "HTTP ERROR" we defined earlier
    }
    throw new Error(errorMessage);
  }
}

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
