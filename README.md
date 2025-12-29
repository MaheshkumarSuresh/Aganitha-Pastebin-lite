# Pastebin Lite

A small Pastebin-like web application that allows users to store and share text content via a shareable link.  
Each paste can optionally expire based on time or number of views.

This project is built as part of a take-home assessment and is designed to be simple, reliable, and easy to explain.

---

## Features

- Create a text paste
- Generate a shareable link
- View paste content using the link
- Optional expiry:
  - Time-based expiry
  - View-count-based expiry
- Proper HTTP status codes for error cases
- Clean and minimal user interface
- Deployed using free-tier services

---

## Tech Stack

- Frontend & Backend: Next.js (App Router)
- Language: TypeScript
- Database: PostgreSQL (Neon)
- Database Client: pg
- Hosting: Vercel

---

## Architecture Overview

- Uses Next.js App Router to combine frontend pages and backend API routes
- Backend logic implemented using API routes under /api
- Frontend consumes APIs to create and view pastes
- Data stored in PostgreSQL hosted on Neon
- Deployed on Vercel

---

## Database Schema

### Table: pastes

| Column       | Type      | Description |
|-------------|-----------|-------------|
| id          | UUID      | Primary key, used for shareable links |
| content     | TEXT      | Paste content |
| expires_at  | TIMESTAMP | Optional time-based expiry |
| max_views   | INTEGER   | Optional maximum allowed views |
| view_count  | INTEGER   | Number of times the paste has been viewed |
| created_at  | TIMESTAMP | Paste creation timestamp |

---

## API Endpoints

### Create Paste

POST /api/paste

Request Body:
{
  "content": "Developed for assignment",
  "expiresIn": 3600,
  "maxViews": 5
}

Response:
{
  "id": "uuid",
  "url": "/paste/uuid"
}

---

### View Paste

GET /api/paste/{id}

Success Response:
{
  "id": "uuid",
  "content": "Developed for assignment",
  "viewCount": 1
}

Error Responses:
- 400 Invalid paste ID
- 404 Paste not found
- 410 Paste expired

---

### List All Pastes

GET /api/paste

Returns a JSON list of recent pastes with metadata and expiry status.

---

## Expiry Logic

- Expiry is enforced at read time
- A paste is expired if:
  - expires_at is set and current time exceeds it
  - max_views is set and view_count reaches the limit
- Expired pastes return HTTP 410 Gone
- Expired pastes are not deleted from the database

---

## Frontend Routes

- / : Create a new paste
- /paste/[id] : View a paste
- /pastes : List all pastes

---

## Environment Variables

Create a .env file in the project root:

DATABASE_URL=postgresql://<username>:<password>@<host>/<database>?sslmode=require

Do not commit this file to Git.

---

## Running Locally

npm install  
npm run dev

Application will run at http://localhost:3000

---

## Deployment

- Hosted on Vercel
- PostgreSQL provided by Neon
- Environment variables configured in Vercel dashboard

---

## Design Decisions

- UUIDs used for non-guessable links
- Plain SQL with pg used instead of ORM to reduce complexity
- Soft expiry chosen for safer data handling
- Clear separation of API and UI routes

---

## Notes on AI Usage

AI tools were used as an assistant during development for debugging, validation, and clarity.  
All implementation details are fully understood and explainable.

---

## License

This project is intended for evaluation and educational purposes.
