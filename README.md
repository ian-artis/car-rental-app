# Car Rental Platform

A full-stack car rental application.  
Current version focuses on the backend API using Node.js, Express, TypeScript, MySQL, and mysql2.

## Current MVP

This MVP includes backend APIs for:

- Car inventory management
- Customer records
- Rental bookings
- Booking price calculation
- Booking overlap validation
- Swagger API documentation

## Tech Stack

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- Swagger UI
- dotenv
- cors

## Backend Features

### Cars

- Get all cars
- Get car by ID
- Create a car
- Update a car
- Delete a car

### Customers

- Get all customers
- Get customer by ID
- Create a customer
- Prevent duplicate customer emails

### Bookings

- Get all bookings with customer and car details
- Get booking by ID
- Create a booking
- Calculate total rental price on the backend
- Prevent overlapping bookings for the same car
- Update booking status
- Delete a booking

## Project Structure

```text
Car-Rental/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── carController.ts
│   │   │   ├── customerController.ts
│   │   │   └── bookingController.ts
│   │   ├── docs/
│   │   │   └── swagger.ts
│   │   ├── routes/
│   │   │   ├── carRoutes.ts
│   │   │   ├── customerRoutes.ts
│   │   │   └── bookingRoutes.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:4000
```

Swagger API docs:

```text
http://localhost:4000/api-docs
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_db
DB_PORT=3306
```

## Database Setup

```sql
CREATE DATABASE IF NOT EXISTS car_rental_db;

USE car_rental_db;

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  car_type VARCHAR(100) NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  car_id INT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (car_id) REFERENCES cars(id)
);
```

## API Endpoints

### Cars

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cars` | Get all cars |
| GET | `/api/cars/:id` | Get car by ID |
| POST | `/api/cars` | Create a car |
| PUT | `/api/cars/:id` | Update a car |
| DELETE | `/api/cars/:id` | Delete a car |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get customer by ID |
| POST | `/api/customers` | Create a customer |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| POST | `/api/bookings` | Create a booking |
| PUT | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete a booking |

## Sample Booking Request

```json
{
  "customer_id": 1,
  "car_id": 1,
  "pickup_date": "2026-06-10",
  "return_date": "2026-06-13"
}
```

Example response:

```json
{
  "message": "Booking created successfully",
  "bookingId": 1,
  "rentalDays": 3,
  "totalPrice": 135
}
```

## Business Logic

The booking API prevents overlapping bookings for the same car.

A booking is rejected if another `pending` or `confirmed` booking already exists for the same car during the selected rental dates.

## Planned Features

- React + TypeScript frontend
- Bootstrap UI
- Admin dashboard
- Authentication
- Form validation
- Unit tests
- Deployment