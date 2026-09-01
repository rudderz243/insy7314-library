# Library App

A full-stack library management application built with Node.js, Express, MongoDB, and a Vite-powered React TypeScript frontend. The application includes HTTPS encryption, role-based access control (RBAC), password hashing, JWT authentication, security middleware, and full CRUD functionality for managing books.

## How to Run the App

### HTTPS SSL Certificates Setup

Before starting the backend or frontend servers for HTTPS, generate local SSL certificates and install the Root CA:

1. Generate local Certificate Authority and localhost certificate in the root directory:
   ```bash
   npx mkcert create-ca
   npx mkcert create-cert localhost
   ```
2. Import the CA certificate (`ca.crt`) into your operating system trust store.
   - On Windows (PowerShell):
     ```powershell
     Import-Certificate -FilePath ".\ca.crt" -CertStoreLocation "Cert:\CurrentUser\Root"
     ```
   - For macOS and Linux import steps, refer to [certificates.md](file:///c:/Users/Glynn/Documents/2026/INSY7314%20-%20APDS/Classwork%20Repo/certificates.md).

### Backend

In order to run the backend application, perform the following steps:

1. In the `backend` folder, create a new file called `.env`.
2. Add your environment variables to `.env`:
   ```env
   CONN_STRING=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
4. Install the required packages:
   ```bash
   npm i
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run over HTTPS on `https://localhost:3000`.

### Frontend

In order to run the frontend application, perform the following steps:

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the required packages:
   ```bash
   npm i
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run over HTTPS on `https://localhost:5173`.

## Install All Packages (Scratch Setup)

If you are creating your own copy of the project from scratch rather than cloning this repository, you can use the commands below to quickly install all required packages.

### Backend Packages (Single Command)

Run this command inside your backend folder:

```bash
npm i express mongoose dotenv cors bcryptjs jsonwebtoken nodemon
```

### Frontend Setup & Packages (Single Command)

Run these commands to create and set up the Vite React TypeScript frontend:

```bash
npx create-vite@latest frontend --template react-ts
cd frontend
npm i react-router-dom
```

## The Required Packages

### Backend

| Package | Why |
| --- | --- |
| Express | Framework used to create the backend web server and API routes |
| Mongoose | Object Data Modeling (ODM) library to interact with the MongoDB database |
| DotEnv | Reads environment variables from the `.env` file |
| Cors | Middleware enabling Cross-Origin Resource Sharing for the frontend |
| BcryptJS | Library for hashing and salting user passwords securely |
| JsonWebToken | Implementation of JSON Web Tokens used for user authentication and authorization |
| Nodemon | Development utility that automatically restarts the Node server on file changes |

### Frontend

| Package | Why |
| --- | --- |
| React | Core UI framework for building interactive user interfaces |
| React-DOM | Package providing DOM-specific methods for React |
| React-Router-Dom | Client-side routing library for navigation between pages |
| Vite | Frontend build tool and high-performance development server |
| TypeScript | Provides static type checking and modern syntax support |

## Environment Variables

The backend requires a `.env` file created inside the `backend/` directory with the following keys:

- `CONN_STRING`: Connection URI string for your MongoDB database instance (local or MongoDB Atlas cloud). Refer to [mongo.md](file:///c:/Users/Glynn/Documents/2026/INSY7314%20-%20APDS/Classwork%20Repo/mongo.md) for local setup and Atlas cloud configuration.
- `JWT_SECRET`: Secret string used by JSON Web Token to sign and verify authentication tokens.

## File Structure

```text
Classwork Repo/
├── backend/                       # Root directory for backend application code
│   ├── controllers/               # Route logic handlers
│   │   ├── authController.js      # Handles user registration and login logic
│   │   ├── bookController.js      # Handles book CRUD operations logic
│   │   └── homeController.js      # Handles health check and test routes logic
│   ├── middleware/                # Express middleware functions
│   │   ├── authMiddleware.js      # Validates incoming JWT tokens and role permissions
│   │   ├── dbMiddleware.js        # Manages MongoDB connection initialization
│   │   └── securityMiddleware.js  # Centralized CORS and security configuration
│   ├── models/                    # Mongoose database schemas and models
│   │   ├── bookModel.js           # Defines Book document schema
│   │   └── userModel.js           # Defines User document schema with password hashing hooks
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js          # Routes for user authentication (/api/auth)
│   │   ├── bookRoutes.js          # Routes for book management (/api/books)
│   │   └── homeRoutes.js          # Routes for system check (/api/home)
│   ├── .env                       # Local environment variables file (ignored by git)
│   ├── .gitignore                 # Specifies untracked files to ignore
│   ├── app.js                     # Main Express HTTPS app initialization and server entry point
│   ├── package-lock.json          # Locked package dependencies list
│   └── package.json               # Backend dependencies and run scripts
├── frontend/                      # Root directory for frontend React application code
│   ├── src/                       # Application source code
│   │   ├── components/            # Reusable React UI components
│   │   │   └── NavBar.tsx         # Navigation bar component
│   │   ├── models/                # TypeScript interfaces and type definitions
│   │   │   └── book.ts            # Book data interface definition
│   │   ├── pages/                 # Full application pages
│   │   │   ├── BookPage.tsx       # Main page for viewing and managing books
│   │   │   └── HealthCheckPage.tsx# Page displaying system health status
│   │   ├── services/              # API communication layer
│   │   │   └── api.ts             # Fetch requests pointing to https://localhost:3000/api
│   │   ├── App.css                # Component specific styles
│   │   ├── App.tsx                # Main App component with router layout
│   │   ├── index.css              # Global styles and layout rules
│   │   └── main.tsx               # Frontend application entry point
│   ├── index.html                 # HTML entry template
│   ├── package.json               # Frontend dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   └── vite.config.ts             # Vite HTTPS server and build configuration
├── ca.crt                         # Root Certificate Authority certificate
├── ca.key                         # Root Certificate Authority private key
├── cert.crt                       # SSL certificate for localhost
├── cert.key                       # SSL private key for localhost
├── certificates.md                # SSL certificate generation and OS import guide
├── mongo.md                       # MongoDB local installation and Atlas cloud setup guide
├── postman-collection             # Exported Postman JSON collection for testing backend API
├── postman.md                     # Postman setup, folder structure, and API testing guide
├── instructions.md                # Class session walkthrough notes and step-by-step instructions
├── LICENSE.md                     # License agreement text
└── README.md                      # Project documentation and setup guide
```

## API Endpoints

### Auth Routes (`/api/auth`)

- `POST /api/auth/register`: Register a new user account with username, email, password, and role (`patron` or `librarian`). Returns user details and JWT token.
- `POST /api/auth/login`: Authenticate existing user with email and password. Returns user details and JWT token.

### Book Routes (`/api/books`)

- `GET /api/books`: Retrieve all books from database (Public).
- `GET /api/books/:id`: Retrieve a specific book by ID (Public).
- `POST /api/books`: Create a new book record (Protected: requires Auth + `librarian` role).
- `PUT /api/books/:id`: Replace an existing book record (Protected: requires Auth + `librarian` role).
- `PATCH /api/books/:id`: Update specific fields of a book record (Protected: requires Auth + `librarian` role).
- `DELETE /api/books/:id`: Remove a book record by ID (Protected: requires Auth + `librarian` role).

### Home Routes (`/api/home`)

- `GET /api/home/healthCheck`: Returns system health status message and timestamp.
- `POST /api/home/greet`: Returns a greeting message.
- `POST /api/home/message`: Echoes input message back.

## Testing with Postman

A pre-configured Postman collection is included in the root folder as `postman-collection`. You can import this file directly into Postman to test all backend routes over HTTPS.

For a complete walkthrough on creating collections, organizing folders, handling JWT authentication, and configuring requests for protected endpoints, refer to [postman.md](file:///c:/Users/Glynn/Documents/2026/INSY7314%20-%20APDS/Classwork%20Repo/postman.md).

## License

The code and documentation in this repository are licensed under the **PolyForm Noncommercial License 1.0.0**.

Under this license, you are free to:

- Use, study, and modify the code for personal, educational, or research purposes
- Share and distribute the code as long as the original license notices are included

You may not:

- Use the software or any derivative works for any commercial purpose

For the full legal terms and conditions, refer to [LICENSE.md](file:///c:/Users/Glynn/Documents/2026/INSY7314%20-%20APDS/Classwork%20Repo/LICENSE.md).
