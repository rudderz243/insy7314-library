# Library App

## How to Run the App

### Backend

In order to run the application, you need to do the following:

1. Clone the repo using the command line, or download a ZIP of the repo.
2. In the `backend` folder, create a new file called `.env`, and add the `CONN_STRING` to it.
3. In the terminal, run `cd backend` to go into the backend folder
4. Run `npm i` to automatically download and install the required packages to run the backend.
5. Run `npm run dev` to start the backend server.

## The Required Packages

### Backend

| Package  | Why                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------- |
| Express  | It allows us to create the backend web server and API                                                |
| Mongoose | It allows us to interact with a MongoDB database                                                     |
| DotEnv   | It allows us to read in variables from a .env file                                                   |
| Nodemon  | It allows us to run the server in a "dev" mode, where it auto-restarts when we make and save changes |

## File Structure

### Backend

```text
FIRST-APP/
└── backend/                       # Root directory for backend code
    ├── controllers/               # Where the logic lives
    │   ├── bookController.js      # Handles logic for book-related requests
    │   └── homeController.js      # Handles logic for our example requests
    ├── middleware/                # Middleware functions
    │   └── dbMiddleware.js        # Middleware for database connection/operations
    ├── models/                    # Data models & schemas
    │   └── bookModel.js           # Defines the schema/structure for Books
    ├── node_modules/              # Installed npm package dependencies
    ├── routes/                    # Where the routing/request handling lives
    │   └── homeRoutes.js          # Defines routes to our example requests
    ├── .env                       # Environment variables
    ├── .gitignore                 # Files and folders to be excluded from Git
    ├── app.js                     # Main entry point for the backend server application
    ├── package-lock.json          # Automatically generated lockfile for packages required
    └── package.json               # Required packages, and scripts to run the app
```

## License

The project in this repository is licensed under the **PolyForm Noncommercial License 1.0.0**.

This means you are free to:

- ✅ Use, study, and modify the code for **personal, educational, or research purposes**
- ✅ Share the code as long as the original license terms are included

You may **not**:

- ❌ Use the code for any **commercial purpose**

See the `LICENSE.md` file for the full license text.
