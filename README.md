# MediTrack AI 🏥

A smart personal health records manager with AI-powered insights.

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- AI: Groq API (Llama 3.3) — free

## Features
- Log and manage doctor visits
- Track active medications
- Record lab results
- Log daily symptoms
- AI health summary powered by Groq

## Project Structure
meditrack-ai/
├── database/
│   └── schema.sql
├── server/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── visits.js
│   │   ├── medications.js
│   │   ├── labs.js
│   │   └── ai.js
│   ├── services/
│   │   └── aiService.js
│   └── index.js
└── client/
    └── src/
        ├── api.js
        ├── App.js
        └── pages/
            └── Dashboard.jsx

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/rakshaa2006/meditrack-ai.git
cd meditrack-ai

### 2. Setup the database
- Install PostgreSQL
- Create database called meditrack_db
- Run database/schema.sql in psql

### 3. Setup backend
cd server
npm install
cp .env.example .env
Add your values in .env file
npm run dev

### 4. Setup frontend
cd client
npm install
npm start

## Environment Variables needed in server/.env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=meditrack_db
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key