# Car Rental Platform

A full-stack car rental application.

## Current MVP

This version includes the backend API for managing cars.

## Tech Stack

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- Swagger UI

## Backend Features

- Get all cars
- Get car by ID
- Create a car
- Update a car
- Delete a car
- Swagger API documentation

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
└── README.md

Backend Setup
cd backend
npm install
npm run dev

The backend runs at:

http://localhost:4000

Swagger API docs:

http://localhost:4000/api-docs
Environment Variables

Create a .env file inside the backend folder:

PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_db
DB_PORT=3306
API Endpoints
Method	Endpoint	Description
GET	/api/cars	Get all cars
GET	/api/cars/:id	Get car by ID
POST	/api/cars	Create a car
PUT	/api/cars/:id	Update a car
DELETE	/api/cars/:id	Delete a car