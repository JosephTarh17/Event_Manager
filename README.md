# Gather Event Planning App

Gather is a learning-focused event-planning MVP built with React, Express,
Mongoose, and MongoDB. It supports event creation, listing, viewing, editing,
deletion, search, a monthly calendar, and light/dark themes.

## Project Status

This is a working three-day MVP, not a production-ready platform.

Implemented:
- MongoDB Event collection with Mongoose validation
- Event API with create, read, update, and delete operations
- React event list and search
- Event create, edit, view, and delete workflows
- Monthly event calendar
- Persistent light/dark theme
- Loading and API error states
- Responsive layout

Not included by scope:
- Accounts or authentication
- Attendee registration
- Payments or ticketing
- Notifications
- Real-time updates
- Advanced analytics
- Recurring events or calendar synchronization

The StarUML model and MongoDB design also document future Client, Guest,
Venue, Vendor, and Staff relationships. Those entities are not implemented by
the current Event API.

## Stack

- Frontend: React 19, Vite, CSS
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Modeling: StarUML

## Repository Structure

```text
Event_Manager/
  Backend/
    models/
      Event.js
    routes/
      events.js
    server.js
    .env.example
  Frontend/
    src/
      App.jsx
      App.css
      index.css
    EXPLAINER.txt
    LEARNING_LOG.txt
  Documents/
    ERD.png
    Event_Planning_Model.mdj
    MongoDB Design.txt
    EVENT PLANNING APP.txt
  README.md
```

## Prerequisites

- Node.js and npm
- MongoDB Community Server or a reachable MongoDB instance
- StarUML if you want to open and edit the model

## Local Setup

### 1. Start MongoDB

Make sure the local MongoDB service is running. The default database name in
this project is `event_planning_app`.

### 2. Configure the backend

Copy the example environment file:

```powershell
Copy-Item Backend\.env.example Backend\.env
```

Set `MONGODB_URI` in `Backend/.env` to your MongoDB connection string.

Example local value:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/event_planning_app
PORT=5000
```

Do not commit `.env`. It can contain private database credentials.

### 3. Install and start the backend

```powershell
cd Backend
npm install
npm run dev
```

The API listens at `http://localhost:5000`.

### 4. Install and start the frontend

Open a second terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally
`http://localhost:5173`.

## API

See [API.md](API.md) for endpoints and examples.

## Event Data

Each event has:

| Field | Rules |
| --- | --- |
| `title` | Required text |
| `description` | Optional text |
| `date` | Required date |
| `topic` | Required text |
| `budget` | Required number, 0 or greater |
| `status` | `Planning` or `Confirmed` |

MongoDB assigns `_id`. Mongoose also maintains `createdAt` and `updatedAt`.

## Validation

Before uploading or sharing, run:

```powershell
cd Frontend
npm run lint
npm run build
```

The backend CRUD endpoints should be checked directly and through the browser:
- create an event
- refresh and verify it is loaded
- edit and refresh
- delete and refresh
- submit an unsupported status and verify HTTP 400

## Learning Files

- [EXPLAINER.txt](Frontend/EXPLAINER.txt): plain-language explanations of the
  concepts and request flow
- [LEARNING_LOG.txt](Frontend/LEARNING_LOG.txt): day-by-day implementation
  notes and validation results
- [MongoDB Design.txt](Documents/MongoDB%20Design.txt): collection and
  reference/embedding decisions
- [EVENT PLANNING APP.txt](Documents/EVENT%20PLANNING%20APP.txt): original
  three-day scope and definition of done

## Known Limitations

- The complete ERD is a design model, while only Event is implemented.
- No authentication or ownership rules exist.
- Filter is currently a placeholder.
- There is no automated test suite.
- No production deployment configuration is included.
