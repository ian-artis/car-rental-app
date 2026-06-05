# Car Rental Platform

A full-stack car rental platform built with React, TypeScript, Node.js, Express, and MySQL.

This project allows users to browse cars, search and filter available vehicles, create bookings, and manage rental data through an admin dashboard.

## Features

### Customer Features

- Browse available rental cars
- View car details
- Search cars by brand or model
- Filter cars by type and status
- Sort cars by price or year
- Create a booking
- Select an existing customer or create a new customer during booking
- Booking date validation for pickup and return dates

### Admin Features

- Admin dashboard with system overview
- View total cars, customers, and bookings
- Manage cars
- Add, edit, and delete cars
- Manage bookings
- Update booking status
- Enforce booking status transition rules
- Manage customers
- Add new customers
- Cleaner admin navigation layout

### Backend Features

- REST API built with Express and TypeScript
- MySQL database integration
- Cars CRUD API
- Customers API
- Bookings API
- Booking overlap validation
- Automatic total price calculation
- Booking status business rules
- Swagger API documentation
- Environment variable configuration

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Bootstrap
- Axios
- React Router

### Backend

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- dotenv
- Swagger

## Project Structure

```text
Car-Rental/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md


Database Tables

The application uses three main tables:

cars
customers
bookings
Cars

Stores rental vehicle information such as brand, model, year, type, daily rate, status, and image URL.

Customers

Stores customer information such as first name, last name, email, and phone number.

Bookings

Stores rental bookings with customer, car, pickup date, return date, total price, and status.

Booking Status Rules

Booking status transitions are controlled by backend business logic.

Allowed transitions:

pending → confirmed
pending → cancelled

confirmed → completed
confirmed → cancelled

completed → cannot be changed
cancelled → cannot be changed

This prevents invalid booking workflows such as changing a completed booking back to pending.

API Endpoints
Cars
GET    /api/cars
GET    /api/cars/:id
POST   /api/cars
PUT    /api/cars/:id
DELETE /api/cars/:id
Customers
GET  /api/customers
GET  /api/customers/:id
POST /api/customers
Bookings
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id/status
DELETE /api/bookings/:id
Getting Started
Prerequisites

Make sure you have installed:

Node.js
npm
MySQL

You can use XAMPP, MySQL Workbench, or another MySQL setup.

Backend Setup

Go into the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_db

Start the backend:

npm run dev

The backend should run on:

http://localhost:4000

Swagger API documentation should be available at:

http://localhost:4000/api-docs
Frontend Setup

Go into the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend should run on:

http://localhost:5173
Main Pages
/                  Home page
/cars              Browse cars
/cars/:id          Car details and booking
/admin             Admin dashboard
/admin/cars        Manage cars
/admin/bookings    Manage bookings
/admin/customers   Manage customers
Future Improvements

Planned features:

Authentication and authorization
Admin and customer roles
Protected admin routes
Customer “My Bookings” page
Backend search and filtering with query parameters
Unit and integration tests
Deployment
Improved UI polish
Purpose of This Project

This project was built as a full-stack portfolio application to demonstrate:

Frontend development with React and TypeScript
Backend API development with Node.js and Express
MySQL database design
CRUD operations
Business logic implementation
API documentation
Admin dashboard development
Git and feature branch workflow