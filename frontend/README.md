# DriveDeck Frontend

The React single-page application for the [DriveDeck Car Dealership Inventory System](../README.md).

It provides authentication, vehicle browsing, search and filtering, purchasing, and administrator inventory controls.

## Technology

* React 19
* JavaScript
* HTML5
* Tailwind CSS 4
* Vite
* Vitest
* React Testing Library
* ESLint

## Features

### Regular users

* Register and log in
* Persist authentication with a JWT
* Browse the vehicle inventory
* Search by make, model, or category
* Filter by category
* Purchase available vehicles
* View updated stock
* See disabled purchase controls when stock is zero
* Log out

### Administrators

* Add vehicles
* Edit vehicle details
* Restock vehicles
* Delete vehicles
* Receive success and error feedback

Admin controls are conditionally displayed from the JWT role. The FastAPI backend remains responsible for enforcing authorization.

## Setup

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend uses `http://localhost:8000` as its default backend.

To configure another API address, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Do not commit environment files containing private configuration.

## Available Commands

| Command              | Purpose                           |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start the Vite development server |
| `npm test`           | Run the Vitest suite once         |
| `npm run test:watch` | Run tests in watch mode           |
| `npm run lint`       | Run ESLint                        |
| `npm run build`      | Create a production build         |
| `npm run preview`    | Preview the production build      |

## Testing

Run the frontend tests:

```powershell
npm test
```

Run all frontend checks:

```powershell
npm test
npm run lint
npm run build
```

Current result: **13 tests passing**, ESLint passing, and the production build completing successfully.

The tests cover:

* Welcome-screen rendering
* Login and registration forms
* Registration API submission
* Login, JWT storage, and dashboard navigation
* Inventory loading
* Search and category filtering
* Purchasing and out-of-stock behavior
* Admin-role controls
* Adding vehicles
* Updating vehicles
* Restocking vehicles
* Deleting vehicles

## Source Structure

```text
src/
├── services/
│   └── api.js
├── test/
│   └── setup.js
├── utils/
│   └── auth.js
├── App.jsx
├── App.test.jsx
├── index.css
└── main.jsx
```

* `App.jsx` contains the SPA screens and inventory interactions.
* `services/api.js` contains all communication with FastAPI.
* `utils/auth.js` reads the JWT role for role-aware UI.
* `App.test.jsx` tests the application through user-visible behavior.

## Authentication Notes

The access token is stored in browser `localStorage` for this assessment. Protected API requests send:

```http
Authorization: Bearer <access_token>
```

For production, secure HTTP-only cookies would be preferred.

## Main Documentation

For database setup, backend commands, API endpoints, screenshots, TDD details, and AI usage, read the [root README](../README.md).
