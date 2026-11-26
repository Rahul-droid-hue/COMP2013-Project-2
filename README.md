# Thrift Happens - Project 2

**Course:** COMP2013 - Web Programming 2  
**Professor:** Ziad Ewais  
**College:** St. Lawrence College

## Project Description

Thrift Happens is a full-stack clothing store application developed using React, TypeScript, Express, and MongoDB. This project builds on Project 1 by replacing the local product data with a MongoDB database.
Users can view clothing products, select quantities, add products to checkout, and remove products from checkout.
Project 2 also allows users to add, edit, and delete clothing products through a form connected to the backend.

### Frontend

- React
- TypeScript
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- CORS
- dotenv

## Project Structure

COMP2013-Project-2/

- frontend/
  - src/
    - Components/
    - assets/
    - data/
  - package.json
- backend/
  - models/
    - clothesItem.ts
  - server.ts
  - seed.ts
  - data.json
  - .env.example
  - package.json
- .gitignore
- README.md

## Requirements

Before running the project, make sure you have:

- Node.js and npm installed
- A MongoDB Atlas account
- A MongoDB Atlas cluster
- A database user with the appropriate permissions
- Your IP address allowed in MongoDB Atlas Network Access

## Backend Setup

### 1. Open the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a `.env` file inside the backend folder.

You can copy the provided `.env.example` file and
replace the placeholder values.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Replace `your_mongodb_atlas_connection_string`
with your own MongoDB Atlas connection string.

Make sure the connection string points to the
`ThriftHappens` database.

Do not upload the real `.env` file to GitHub.

### 4. Seed the database

The `backend/data.json` file contains the original
50 clothing products from Project 1.

Run:

```bash
npx tsx seed.ts
```

The seed script connects to MongoDB and inserts
products that are not already present, using their
numeric IDs to avoid duplicates.

### 5. Start the backend

```bash
npm run dev
```

The Express server runs at:

http://localhost:5000

The product API is available at:

http://localhost:5000/data

## Frontend Setup

Open a second terminal.

### 1. Open the frontend folder

From the project root:

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Open the URL displayed by Vite, normally:

http://localhost:5173

Keep both frontend and backend servers running
while using the application.

## API Endpoints

The Express backend provides four CRUD endpoints.

### GET /data

Retrieves all clothing products from MongoDB.

### POST /data

Creates a new clothing product.

The backend assigns a numeric product ID and
initializes the selected quantity to zero.

### PATCH /data/:id

Updates an existing clothing product using
its numeric ID.

### DELETE /data/:id

Deletes a clothing product using its numeric ID.

The API returns JSON responses and appropriate
HTTP status codes for successful operations and errors.

## Application Features

### Clothing Catalogue

- Displays clothing products from MongoDB
- Shows product images and details
- Displays prices and available stock
- Handles loading, empty, and error states

### Add and Edit Products

- Uses a reusable controlled React form
- Validates the required fields
- Adds products using Axios POST
- Edits products using Axios PATCH
- Refreshes the catalogue after saving

### Delete Products

- Deletes products through Axios DELETE
- Updates the displayed catalogue
- Prevents deleting products currently in checkout

### Shopping Cart

- Increase or decrease the selected quantity
- Prevent selection above available stock
- Prevent negative selected quantities
- Add products to checkout
- Display checkout quantities and totals
- Remove products from checkout
- Empty the checkout
- Restore available stock when items are removed

## Building the Project

To build the frontend:

```bash
cd frontend
npm run build
```

To build the backend:

```bash
cd backend
npm run build
```

## Notes

- MongoDB Atlas is required to run the application.
- The original catalogue contains 50 clothing products.
- The frontend retrieves its catalogue through the API.
- Real environment credentials are excluded from Git.
- The `.env.example` file contains placeholders only.
- The `node_modules` and `dist` folders are excluded
  from Git.
- Frontend and backend run as separate applications.

## Submission

The project is submitted through its GitHub repository
for COMP2013 - Web Programming 2, Project 2.
