# XY Essentials - D2C Men's Skincare Brand

This repository contains the frontend and backend code for XY Essentials, a direct-to-consumer (D2C) men's skincare brand e-commerce website. The project is built using **React** for the frontend and **Node.js** with **Express** for the backend. **MongoDB** is used for the database, and various third-party services are integrated, including Google OAuth, Razorpay, and SendGrid.

## Project Structure

- **Frontend (Client)**: Runs on port `5173`
- **Backend (Server)**: Runs on port `5000`
- **Database**: MongoDB (local/Atlas)

## Features

1. **User Authentication**:
   - Google OAuth 2.0 for login
   - JWT-based authentication
   - Session management with encrypted cookies

2. **E-commerce Functionality**:
   - Product listing, filtering, and searching
   - User registration and login
   - Cart, order management, and payment processing via Razorpay
   - User profile management

3. **Admin Panel**:
   - Dashboard with analytics (orders, revenue, user growth)
   - Manage products (add/edit/delete)
   - Manage orders and users

4. **Email Service**:
   - Send transactional emails (order confirmations, updates) using SendGrid.

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)

### Clone the repository
```bash
git clone https://github.com/goyalaakarsh/xy-essentials.git
cd xy-essentials
```

### Backend Setup

1. Navigate to the `server` folder:

   ```bash
   cd server
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file inside the `server/config` folder and add the following environment variables:

   ```bash
   MONGO_URI=mongodb://localhost:27017/xyessentials
   # Or use MongoDB Atlas connection string:
   MONGO_URI=mongodb+srv://Aakarsh:xyessen@xy-essentials.xhqbs.mongodb.net/?retryWrites=true&w=majority&appName=XY-Essentials

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

   SESSION_SECRET=your_session_secret

   JWT_SECRET=your_jwt_secret
   JWT_TIMEOUT='30d'

   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret

   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender_email@example.com

   PORT=5000
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `client` folder:

   ```bash
   cd ../client
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`.

## Usage

- Access the frontend by visiting `http://localhost:5173`.
- The backend API runs at `http://localhost:5000`.

## Third-Party Integrations

1. **Google OAuth**: Used for user authentication.
2. **Razorpay**: Integrated for processing payments.
3. **SendGrid**: For sending transactional emails to users.

Make sure to replace the placeholder keys (`your_google_client_id`, `your_razorpay_key_id`, etc.) in the `.env` file with your actual API keys.

## Scripts

### Backend (server)
- `npm start`: Starts the backend server in production mode.
- `npm run dev`: Starts the backend in development mode with nodemon.

### Frontend (client)
- `npm run dev`: Starts the frontend in development mode.

## Folder Structure

```
├── client
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       ├── context
│       └── pages
├── server
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── validations
│   └── server.js
└── README.md
```
