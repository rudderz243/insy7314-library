# Classwork Instructions & Process Guide

These are the step-by-step instructions to follow the process completed during class sessions.

---

## Package Quick Installation Guide (Scratch Setup)

If you are setting up the project from scratch without cloning, use these single-line commands:

### Backend Package Installation

```bash
cd backend
npm i express mongoose dotenv cors bcryptjs jsonwebtoken nodemon
```

### Frontend Package Installation

```bash
npx create-vite@latest frontend --template react-ts
cd frontend
npm i react-router-dom
```

---

## 14/07 - Initializing the Backend Server

- Packages: `express`, `nodemon`
- Initialization: `npm init -y`

1. Created a root project directory called `first app` and opened it in VS Code.
2. Created two subdirectories: `backend` and `frontend` to separate the backend API from the client interface.
3. Navigated into the backend folder in the terminal:
   ```bash
   cd backend
   ```
4. Initialized Node.js project:
   ```bash
   npm init -y
   ```
5. Installed Nodemon for development server auto-reloading:
   ```bash
   npm i nodemon
   ```
6. Installed Express to build the web server and API routes:
   ```bash
   npm i express
   ```
7. Created `app.js` as the main entry point for the Express backend application.

---

## 16/07 - Session 1 (08:00 - 10:00): Controllers & Routes Architecture

- Objective: Modularizing app logic by separating routing from controller logic.

1. Created new subdirectories in `backend`: `controllers` and `routes`.
2. Created `homeController.js` inside `controllers/` to handle logic for system and test requests.
3. Moved request handler functions into `homeController.js`.
4. Created `homeRoutes.js` inside `routes/` to define API endpoints and map requests to corresponding controller functions.
5. Updated `app.js` to import `homeRoutes.js` and register the route prefix using `app.use("/api/home", homeRoutes)`.

---

## 16/07 - Session 2 (10:00 - 12:00): Database Connection & Data Models

- Packages: `mongoose`, `dotenv`

1. Installed Mongoose ODM and DotEnv package inside `backend`:
   ```bash
   npm i mongoose dotenv
   ```
2. Created two new subdirectories in `backend`: `middleware` and `models`.
3. Created `dbMiddleware.js` inside `middleware/` to handle connecting to MongoDB database using Mongoose.
4. Created `bookModel.js` inside `models/` to define the Book schema (title, author, genre, publishedYear, status).
5. Created `.env` and `.gitignore` files in the root of `backend/`.
6. Defined database connection string in `.env`:
   ```env
   CONN_STRING=your_mongodb_connection_string
   ```
7. Added `.env` and `node_modules` to `.gitignore` to prevent secret key and package commits.
8. Updated `dbMiddleware.js`, `bookModel.js`, and updated `app.js` to connect to database before starting server.
9. Created `bookController.js` inside `controllers/` to implement CRUD logic for books.

---

## 22/07 - Book CRUD Completion & Route Integration

- Completed CRUD handler methods in `bookController.js` (`createBook`, `getAllBooks`, `getBook`, `updateBook`, `replaceBook`, `deleteBook`).
- Created `bookRoutes.js` inside `routes/` mapping endpoints:
  - `POST /` -> `createBook`
  - `GET /` -> `getAllBooks`
  - `GET /:id` -> `getBook`
  - `PUT /:id` -> `replaceBook`
  - `PATCH /:id` -> `updateBook`
  - `DELETE /:id` -> `deleteBook`
- Updated `app.js` to mount book routes under `/api/books`.
- Tested endpoints using Postman.

---

## 29/07 - Frontend Integration & Backend CORS Configuration

### Frontend Setup

- Packages: `react-router-dom`
- Tooling: Vite with React and TypeScript

1. Created Vite React TypeScript application:
   ```bash
   npm create vite@latest
   ```
   Select options: `React`, `TypeScript`, `ESLint`.
2. Installed client-side router inside `frontend`:
   ```bash
   cd frontend
   npm i react-router-dom
   ```
3. Created `src/components/` directory and added `NavBar.tsx` for header navigation.
4. Created `src/models/` directory and added `book.ts` defining the TypeScript `Book` interface.
5. Created `src/services/` directory and added `api.ts` with fetch requests to backend endpoints (`getBooks`, `getBook`, `createBook`, `updateBook`, `replaceBook`, `deleteBook`).
6. Created `src/pages/` directory and added `BookPage.tsx` and `HealthCheckPage.tsx`.
7. Updated `App.tsx` with BrowserRouter and route mappings (`/` to `BookPage`, `/health` to `HealthCheckPage`).
8. Configured layout styling in `index.css` and `App.css`.

### Backend CORS Setup

- Packages: `cors`

1. Installed CORS package inside `backend`:
   ```bash
   npm i cors
   ```
2. Configured CORS in `app.js`:
   ```javascript
   const corsOptions = {
     origin: "http://localhost:5173",
     credentials: true,
     optionsSuccessStatus: 200,
   };
   app.use(cors(corsOptions));
   ```

---

## 31/07 - Postman API Documentation & Testing

1. Created a Postman account, workspace, and a collection named `INSY7314`.
2. Structured the collection into dedicated request folders:
   - `Auth Requests`
   - `Services Requests`
   - `Transaction Requests`
   - `Booking Requests`
   - `Book Requests`
3. Created and configured API requests in the `Book Requests` folder:
   - `Get ALL Books from the API`: `GET http://localhost:3000/api/books` to retrieve all book records.
   - `Add a NEW Book`: `POST http://localhost:3000/api/books` with a JSON raw body containing book details (`title`, `author`, `isbn`, `publishedYear`, `genre`).
   - `Get a SINGLE Book`: `GET http://localhost:3000/api/books/:id` to retrieve a book by its MongoDB Object ID.
   - `Update EXISTING Book`: `PATCH http://localhost:3000/api/books/:id` with a JSON raw body to modify specific fields (e.g. `title`).
   - `Replace EXISTING Book`: `PUT http://localhost:3000/api/books/:id` with a JSON raw body to replace an entire book document.
   - `Delete EXISTING Book`: `DELETE http://localhost:3000/api/books/:id` to remove a book document by ID.
4. Tested each route against the running Express backend to verify HTTP status codes and JSON responses.
5. Exported the completed Postman collection to the root directory as `postman-collection` for repository documentation and testing.

---

## 03/08 - Authentication & Role-Based Access Control (RBAC)

- Packages: `bcryptjs`, `jsonwebtoken`

1. Installed authentication dependencies inside `backend`:
   ```bash
   npm i bcryptjs jsonwebtoken
   ```
2. Updated `.env` file to add JWT secret key:
   ```env
   JWT_SECRET=your_jwt_secret_key
   ```
3. Created `userModel.js` inside `backend/models/`:
   - Defined `userSchema` with fields `username`, `email` (unique, lowercase), `password`, and `role` (enum: `patron`, `librarian`, default: `patron`).
   - Added Mongoose `pre("save")` hook to automatically salt and hash user passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()`.
   - Added instance method `matchPassword` using `bcrypt.compare()` to compare entered plain passwords against database hash.
4. Created `authController.js` inside `backend/controllers/`:
   - Defined `generateToken(id, role)` helper function using `jwt.sign()` with a 7-day expiration.
   - Implemented `registerUser`: checks required fields, validates duplicate email via `User.findOne()`, creates new user document, and returns user details plus JWT token.
   - Implemented `loginUser`: verifies user existence, checks password using `matchPassword()`, and returns user details plus JWT token.
5. Created `authMiddleware.js` inside `backend/middleware/`:
   - Implemented `validateAuth`: extracts Bearer token from `Authorization` header, verifies token using `jwt.verify()`, looks up user by ID excluding password (`select("-password")`), and attaches user object to `req.user`.
6. Created `authRoutes.js` inside `backend/routes/`:
   - Mapped `POST /register` to `registerUser`.
   - Mapped `POST /login` to `loginUser`.
7. Updated `app.js`:
   - Imported `authRoutes` from `./routes/authRoutes.js`.
   - Mounted auth routes under `/api/auth` using `app.use("/api/auth", authRoutes)`.
