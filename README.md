Notes App

This project is a simple Notes Application built with Node.js for the backend and any frontend framework/library of your choice. It allows users to register, log in, and manage their notes with features like pinning, searching, and tagging.

Features
Backend
1) User Authentication:
    -> Registration with validation.
    -> Login with JWT-based authentication.
    -> Secure access to user-specific data.
2) Notes Management:
    -> Create, read, update, and delete notes.
    -> Pin/unpin notes for prioritization.
    -> Search notes by title or content.
3) Frontend
    -> User-friendly interface for managing notes.
    -> Token-based authentication for secure API access.
    -> Real-time note updates (CRUD operations).
   
Installation and Setup
Prerequisites
Node.js (v14 or later)
MongoDB (local or cloud-based)
Environment variables setup (.env file)
Backend Setup
Clone the repository:

bash
Copy code
git clone <repository_url>
cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

env
Copy code
PORT=5000
MONGO_URI=<your_mongo_connection_string>
ACCESS_TOKEN_SECRET=<your_secret_key>
Start the server:

bash
Copy code
npm start
The backend will run on http://localhost:5000.

API Endpoints
Authentication
Endpoint	Method	Description
/create-account	POST	Register a new user.
/login	POST	Login and get a JWT token.
/get-user	GET	Fetch the authenticated user details.
Notes
Endpoint	Method	Description
/add-note	POST	Create a new note.
/edit-note/:noteId	PUT	Edit an existing note.
/get-all-notes	GET	Fetch all notes for the authenticated user.
/delete-note/:noteId	DELETE	Delete a note.
/update-note-pinned/:noteId	PUT	Pin or unpin a note.
/search-notes	GET	Search notes by title or content.
Frontend Setup
Navigate to the frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

env
Copy code
REACT_APP_API_URL=http://localhost:5000
Start the frontend:

bash
Copy code
npm start
The frontend will run on http://localhost:3000.

Usage
Open the application in your browser at http://localhost:3000.
Register a new account or log in with an existing one.
Use the interface to:
Create, edit, delete, and view notes.
Pin important notes for quick access.
Search for notes by title or content.
Environment Variables
Backend
Variable	Description
PORT	Port on which the server runs (default: 5000).
MONGO_URI	MongoDB connection string.
ACCESS_TOKEN_SECRET	Secret key for JWT authentication.
Frontend
Variable	Description
REACT_APP_API_URL	URL of the backend API (default: http://localhost:5000).








// Backend Link :- https://notes-app-backend-nsci.onrender.com
// Frontend Link :- https://notes-app-1yp7.onrender.com

<-----------------------------  Live Hosted Link  ------------------------------------->
[notes-app](https://notes-app-1yp7.onrender.com)
