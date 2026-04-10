# FinanceAI Phase 1

FinanceAI is a modern, full-stack MERN web application built for personal finance management. This is the first phase setup, containing core functionalities like user authentication, income/expense transaction logging, financial goal tracking, a real-time dashboard, and skeleton components setup for upcoming Generative AI features in Phase 2.

## Technologies Used
- **Frontend** React.js (Vite), React Router v6, Tailwind CSS, Recharts
- **Backend** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT)

## Environment Setup

You need two `.env` files.

**1. `server/.env`**
Create `.env` in the `/server` directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/financeai
JWT_SECRET=supersecretjwtkey_12345
```
Make sure MongoDB is running on your machine on port 27017, or use a Mongo Atlas URI.

**2. `client/.env`**
Create `.env` in the `/client` directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## How to Run

### Seed the Database (Optional but recommended)
We have a seed script that creates a test user and populates sample transactions and goals so you can see the dashboard charts in action.
```bash
cd server
npm i
node seed.js
```
The test user created will be:
- **Email:** `test@financeai.com`
- **Password:** `test1234`

### Starting the Application

You will need two terminals running simultaneously.

**Terminal 1 (Backend Server):**
```bash
cd server
npm start # or npm run dev if you set up nodemon
# Runs on localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm start # or npm run dev
# Runs on localhost:5173
```
Open your browser and navigate to the frontend URL!
