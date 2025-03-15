# Nabadisha Backend APIs

## Overview
This is the backend service for Nabadisha, developed using **Fastify**. It provides APIs for user authentication, role-based access control, and dashboard management.

## Tech Stack
- **Fastify** (Node.js framework)
- **MongoDB** (Database)
- **Swagger (OpenAPI 3.0)** (API Documentation)
- **JWT Authentication** (User Authentication & Authorization)

## Installation
To set up the project locally, follow these steps:

### Prerequisites
- Node.js (v16 or later)
- MongoDB instance (local or cloud)

### Steps
```sh
# Clone the repository
git clone https://github.com/your-repo/nabadisha-backend.git
cd nabadisha-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Environment Variables
Update the `.env` file with the following variables:
```env
PORT=
DB_NAME=
MONGO_URI=
JWT_SECRET=
```

## Running the Project
```sh
# Start the Fastify server
npm run dev
```
The API will be available at `http://localhost:5000`.

## API Documentation
After running the server, access the Swagger API docs at:
```
http://localhost:5000/docs
```

## API Endpoints

### Access Control
| Method | Endpoint | Description |
|--------|------------|-------------|
| **POST** | `/api/v1/access-control/create-role` | Create a new role |
| **POST** | `/api/v1/access-control/create-permission` | Create a new permission |

### Dashboard
| Method | Endpoint | Description |
|--------|------------|-------------|
| **POST** | `/api/v1/dashboard/dashmenu` | Fetch dashboard menu |

### User Management
| Method | Endpoint | Description |
|--------|------------|-------------|
| **GET** | `/api/v1/user/getAllUsers` | Retrieve all users |
| **POST** | `/api/v1/user/createUser` | Create a new user |
| **PUT** | `/api/v1/user/updateUser` | Update user details |
| **POST** | `/api/v1/user/updateUserRole` | Update a user's role |
| **POST** | `/api/v1/user/login` | User login |

## Authentication & Authorization
- The APIs are secured using JWT tokens.
- Admin roles are required for creating roles and permissions.
- Users need to provide a valid token for restricted actions.

---
Made by [Nikhil Mahato](https://github.com/Mahato12nikhil) .



