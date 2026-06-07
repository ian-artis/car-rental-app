# Car Rental Booking System

A full-stack car rental booking application built with React, TypeScript, Node.js, Express, and MySQL.

The app allows public users to browse available cars and submit booking requests. Admin users can log in to manage cars, customers, and bookings through a protected admin dashboard.

## Features

### Public Users

- View available rental cars
- View car details
- Submit booking requests
- Choose pickup or delivery option
- Delivery option adds an additional fee

### Admin Users

- Admin login with JWT authentication
- Protected admin dashboard
- View booking statistics
- Manage cars
- View customers
- Manage booking statuses:
  - Pending
  - Confirmed
  - Cancelled
  - Completed
- Logout functionality

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- Axios
- Auth Context

### Backend

- Node.js
- Express
- TypeScript
- MySQL
- JWT Authentication
- bcryptjs
- Swagger API Documentation

## Project Structure

```text
car-rental-app
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── docs
│   │   ├── middleware
│   │   ├── routes
│   │   └── server.ts
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   └── App.tsx
│   └── package.json
│
└── README.md

Getting Started
1. Clone the repository
git clone https://github.com/ian-artis/car-rental-app.git
cd car-rental-app
Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_db
JWT_SECRET=your_secret_key_here

Start the backend server:

npm run dev

The backend runs on:

http://localhost:4000

Swagger API documentation is available at:

http://localhost:4000/api-docs
Frontend Setup

Go to the frontend folder:

cd frontend

Install dependencies:

npm install

Create a .env file:

VITE_API_BASE_URL=http://localhost:4000/api

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:5173
Admin Login

Use the admin account created in the database.

Example:

Email: admin@test.com
Password: admin123

Admin users can access:

/admin/login

After logging in, the admin can access the dashboard, cars, bookings, and customers pages.

API Documentation

This project includes Swagger documentation for the backend API.

Local Swagger URL:

http://localhost:4000/api-docs
Environment Variables
Backend
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
Frontend
VITE_API_BASE_URL=
Deployment Notes

For deployment:

Add backend environment variables in Railway
Add frontend environment variables in Vercel
Make sure VITE_API_BASE_URL points to the deployed backend URL ending in /api

Example:

VITE_API_BASE_URL=https://your-backend-url.up.railway.app/api
Status

This project is currently being developed as a portfolio project to demonstrate full-stack web development skills, including authentication, protected routes, CRUD operations, API integration, and database management.