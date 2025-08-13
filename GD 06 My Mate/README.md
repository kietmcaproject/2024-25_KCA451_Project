# MyMate

Project Link : https://my-mate-weld.vercel.app/

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [API Documentation](#api-documentation)
9. [Upcoming Features](#upcoming-features)


---

## Overview
**MyMate** is a professional networking web application focused on facilitating mentorship and collaboration among juniors and seniors. Similar to LinkedIn, it enables users to share experiences, provide learning resources, and build professional connections.

This project is currently under development by a team of four, each with assigned roles for backend development, UI/UX design, database management, and QA. The minimum viable product (MVP) aims to deliver essential features such as user authentication, post creation, chat functionality, and a following system, to be showcased in a project presentation within the next 10 days.

---

## Features
- **User Authentication**: Secure login and signup with JWT and bcrypt for password hashing.
- **Post Management**: Users can create, like, share, save, and delete posts.
- **Real-Time Chat**: Chat system for user-to-user communication using WebSocket (Socket.io).
- **Follow System**: Follow/unfollow functionality for connecting with other users.
- **User Profile**: View, edit, and manage user profiles.
- **Notifications**: System-generated alerts for likes, comments, follows, and more.
- **Search Functionality**: Search for users or posts within the platform.

---

## Tech Stack
### Backend
- **Node.js** & **Express.js**: For server-side development and API endpoints.
- **MongoDB**: Database for storing and managing user, post, and chat data.
- **JWT & bcrypt**: For secure authentication and password hashing.
- **Socket.io**: For real-time chat functionality.

### Frontend
- **React.js** or **EJS** (based on choice): For building responsive, dynamic UIs.
- **CSS/SCSS**: For styling, ensuring consistency and accessibility.

### Tools & Services
- **Cloudinary**: For media and image storage.
- **Postman**: API testing and documentation.
- **Heroku/Vercel**: Deployment and hosting of the application.

---

## Project Structure
```
MyMate/
├── backend/             # Backend logic and API routes
│   ├── controllers/     # Request handling logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions and middleware
├── frontend/            # Frontend code
│   ├── components/      # UI components (Auth, Chat, Post, etc.)
│   └── pages/           # Different pages (Profile, Chat, Home, etc.)
├── config/              # Configuration files
└── README.md            # Project documentation
```

---

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (version 14+)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/MyMate.git
   cd MyMate
   ```

2. **Install Dependencies**:
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Variables**:
   Create a `.env` file in the backend directory with the following variables:
   ```plaintext
   MONGODB_URI=<Your MongoDB Connection String>
   JWT_SECRET=<Your JWT Secret Key>
   CLOUDINARY_URL=<Your Cloudinary URL>
   ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```
   Visit `http://localhost:3000` in your browser to access the application.

---

## API Documentation
The API documentation provides detailed information on each endpoint, including methods, parameters, and sample requests. You can explore and test the endpoints using tools like Postman.

### Key Endpoints
- **Authentication**:
  - `POST /api/auth/signup`: Register a new user.
  - `POST /api/auth/login`: Authenticate user and generate a JWT token.
  - `GET /api/auth/logout`: Log out the user.

- **Posts**:
  - `POST /api/posts`: Create a new post.
  - `GET /api/posts`: Retrieve all posts.
  - `POST /api/posts/:id/like`: Like/unlike a post.

- **Chat**:
  - `POST /api/chat`: Initiate a chat with a user.
  - `GET /api/chat/:userId`: Get chat history with a specific user.


---

## Upcoming Features
- **OAuth Integration**: Add login options via Google and Facebook.
- **Push Notifications**: Real-time notifications for interactions like likes, comments, and follows.
- **Advanced Search**: Add sorting and filtering options to improve search accuracy.

