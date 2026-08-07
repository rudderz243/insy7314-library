# These are the instructions to follow the same process we followed in class:

## 14/07

- New project: `npm init -y`
- New packages: `npm i express nodemon`

1. We created a folder called `first app` to hold our app, and opened this folder in VS Code.
2. We then created 2 new folders, `backend` and `frontend` - this allows us to seperate our project into pieces.
3. In the `backend` folder, we ran `npm init`, this creates a new Node.js project for us to work with.
4. In the terminal, we then ran `cd backend` to start working in the backend.
5. We then ran `npm i nodemon` to install nodemon, which allows us to run our app in development mode.
6. We then ran `npm i express` to install express, which we will use to create our backend API and web server.
7. We then created a file called `app.js` which we wrote our basic code into.

## 16/07 - S1 8-10

- Once we were happy with the basic code, we started breaking down our code into smaller pieces.

1. We created new folders called `controllers` and `routes`
2. In the `controllers` folder, we created a new file, `homeController.js`
3. We moved some of our code into this file (as it now handles the logic of requests)
4. In the `routes` folder, we then created `homeRoutes.js`
5. We wrote some new code in here (the routes map the incoming request to the right function in the controllers)
6. We updated the `app.js` to make use of the

## 16/07 - S2 10-12

- Once we had seen the basics of routing and controllers, we started interacting with the database
- New packages: `npm i mongoose dotenv`

1. In the terminal, in the backend folder, we ran `npm i mongoose dotenv` to install the 2 new required packages.
2. We then created 2 new folders, `middleware` and `models`
3. In the `middleware` folder, we created `dbMiddleware.js` to handle our servers connection to the database
4. In the `models` folder, we created `bookModel.js` to define what information a book has
5. In the main `backend` folder, we created 2 new files, `.env` and `.gitignore`
6. In the `.env` file, we added our connection string as CONN_STRING
7. In the `.gitignore` file, we added 2 lines to stop the `.env` file and the `node_modules` folder from being pushed to GitHub
8. We then wrote code in the `dbMiddleware.js` and `bookModel.js` files, and modified our `app.js`
9. We then created `bookController.js` in the `controllers` folder to handle CRUD for our Book endpoint

## 22/07

- Finished `bookController.js`
- Finished `bookRoutes.js`
- Updated `app.js`
- Tested the application in Postman

## 29/07

### Frontend

New packages: `npm i react-router-dom`

1. Created a Vite.js frontend application using `npm create vite@latest`
2. Select the options Typescript, React, ESLint
3. In the frontend folder, install the required package by running `npm i react-router-dom`
4. Create a folder `components`, and in that folder, `NavBar.tsx`
5. Create a folder `models`, and in that folder, `book.ts`
6. Create a folder `services`, and in that folder, `api.ts`
7. Create a folder `pages`, and in that folder, `BookPage.tsx` and `HealthCheckPage.tsx`
8. Modify `App.tsx` and `index.css`

### Backend

- New packages: `npm i cors`

1. In the backend, install the required packages by running `npm i cors`
2. Modify `app.js` to add cors options

## 31/07

- Created Postman accounts
- Created a collection, with folders and routes, for the backend
- Tested each backend route

## 03/08

- Started with RBAC
- New packages: `npm i jsonwebtoken`

1. Created `authMiddleware.js`, `authController.js`, `authRoutes.js`
2. Completed code in controller and routes
3. Started with middleware
