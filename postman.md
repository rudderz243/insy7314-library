# Postman API Testing Guide

This guide walks through creating and organizing a Postman collection to test the Library App backend API, configuring authentication tokens for protected routes, and setting up requests for each endpoint.

---

## 1. Setting Up Postman & SSL Configuration

Because the backend server runs over HTTPS using local SSL certificates (`https://localhost:3000`), Postman needs to allow local certificates:

1. Open Postman.
2. Go to **Settings** (gear icon in top right) -> **General**.
3. Toggle **SSL certificate verification** to **OFF** (or import `ca.crt` under **Settings** -> **Certificates** -> **CA Certificates**).

---

## 2. Creating the Collection & Folder Structure

1. In the left sidebar of Postman, click **Collections** -> **Create Collection** (`+` icon).
2. Name the collection: `INSY7314`.
3. Right-click the `INSY7314` collection and select **Add Folder** to create the following folder hierarchy matching the project structure:
   - `Auth Requests`
   - `Book Requests`
   - `Services Requests`
   - `Transaction Requests`
   - `Booking Requests`

---

## 3. Authentication & Protected Routes Workflow

Several routes in the API (such as adding, updating, and deleting books) are protected using JSON Web Tokens (JWT) and Role-Based Access Control (RBAC).

### Why Authentication is Required First

Protected endpoints check for a valid `Authorization: Bearer <token>` header and verify that the user possesses the `librarian` role:
- If no token is provided, the API returns `401 Unauthorized`.
- If a token is provided but belongs to a user with the `patron` role, the API returns `403 Forbidden`.

Therefore, you must register or log in first to generate a token before testing protected endpoints.

### How to Authenticate and Use Tokens in Postman

1. Send a request to **Register** or **Login** (detailed in Section 4).
2. From the JSON response, copy the value of the `token` field.
3. Open any protected request (for example, `Add a NEW Book` or `Delete EXISTING Book`).
4. Click on the **Authorization** tab located below the request URL bar.
5. Set **Type** to **Bearer Token**.
6. Paste the copied token into the **Token** input field.
7. Postman will automatically include the `Authorization: Bearer <token>` header when sending the request.

---

## 4. Endpoints & Request Configurations

### Auth Requests Folder

#### 1. Register a New User
- Method: `POST`
- URL: `https://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "username": "librarian_user",
    "email": "librarian@library.com",
    "password": "SecurePassword123!",
    "role": "librarian"
  }
  ```
- Response: Returns HTTP 201 with user details and a JWT token.

#### 2. Login Existing User
- Method: `POST`
- URL: `https://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "librarian@library.com",
    "password": "SecurePassword123!"
  }
  ```
- Response: Returns HTTP 200 with user details and a JWT token.

---

### Book Requests Folder

#### 1. Get ALL Books from the API
- Method: `GET`
- URL: `https://localhost:3000/api/books`
- Access: Public (no token required)
- Response: Returns HTTP 200 with an array of all book documents.

#### 2. Add a NEW Book
- Method: `POST`
- URL: `https://localhost:3000/api/books`
- Access: Protected (requires Bearer Token with `librarian` role)
- Authorization: Type = Bearer Token -> Paste JWT
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "title": "Why Java is the Best Programming Language",
    "author": "Courteney Young",
    "isbn": "abc-123",
    "publishedYear": 2011,
    "genre": "Textbook"
  }
  ```
- Response: Returns HTTP 201 with the newly created book document including `_id`.

#### 3. Get a SINGLE Book
- Method: `GET`
- URL: `https://localhost:3000/api/books/:id`
  (Replace `:id` with an actual MongoDB Object ID from the database)
- Access: Public (no token required)
- Response: Returns HTTP 200 with the matching book document.

#### 4. Update EXISTING Book (Partial Update)
- Method: `PATCH`
- URL: `https://localhost:3000/api/books/:id`
- Access: Protected (requires Bearer Token with `librarian` role)
- Authorization: Type = Bearer Token -> Paste JWT
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "title": "TypeScript is Difficult"
  }
  ```
- Response: Returns HTTP 200 with the updated book object.

#### 5. Replace EXISTING Book (Full Replacement)
- Method: `PUT`
- URL: `https://localhost:3000/api/books/:id`
- Access: Protected (requires Bearer Token with `librarian` role)
- Authorization: Type = Bearer Token -> Paste JWT
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "title": "Graduating is Easy",
    "author": "Jordan Forlee",
    "isbn": "numbers",
    "publishedYear": 1234,
    "genre": "Fiction"
  }
  ```
- Response: Returns HTTP 200 with the replaced book object.

#### 6. Delete EXISTING Book
- Method: `DELETE`
- URL: `https://localhost:3000/api/books/:id`
- Access: Protected (requires Bearer Token with `librarian` role)
- Authorization: Type = Bearer Token -> Paste JWT
- Response: Returns HTTP 200 with the deleted book document.

---

### Home & System Requests

#### 1. System Health Check
- Method: `GET`
- URL: `https://localhost:3000/api/home/healthCheck`
- Access: Public
- Response: Returns HTTP 200 with API health status and uptime timestamp.

#### 2. Greet Endpoint
- Method: `POST`
- URL: `https://localhost:3000/api/home/greet`
- Access: Public
- Body (raw JSON):
  ```json
  {
    "name": "Alex"
  }
  ```

#### 3. Echo Message Endpoint
- Method: `POST`
- URL: `https://localhost:3000/api/home/message`
- Access: Public
- Body (raw JSON):
  ```json
  {
    "message": "Hello from Postman"
  }
  ```

---

## 5. Exporting and Importing Collections

### Exporting Your Collection

1. In Postman, click the three dots (`...`) next to your `INSY7314` collection.
2. Select **Export**.
3. Choose **Collection v2.1 (recommended)** and click **Export**.
4. Save the file into your repository root as `postman-collection.json`.

### Importing the Existing Collection

If you or a teammate clone this repository and want to load the pre-built requests:
1. Open Postman and click **Import** (top left).
2. Drag and drop the `postman-collection.json` file from the repository root.
3. The `INSY7314` collection will appear in your workspace with all endpoints and sample bodies ready to test.
