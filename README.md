# DriveDeck — Car Dealership Inventory System

A full-stack car dealership inventory application built using Test-Driven Development. Users can register, authenticate, browse inventory, search vehicles, and purchase available stock. Administrators can manage the complete inventory through role-protected operations.

Repository: [github.com/adithakur22/car-dealership](https://github.com/adithakur22/car-dealership)

## Features

### User features

* Register with email and password
* Log in using JWT authentication
* View persisted vehicle inventory
* Search by make, model, or category
* Filter vehicles by category
* Purchase vehicles
* View live stock quantities
* Disabled purchasing for out-of-stock vehicles
* Persistent login across page refreshes
* Log out securely from the frontend

### Administrator features

* Create an administrator using a secure CLI command
* Add vehicles
* Update vehicle details
* Delete vehicles with confirmation
* Restock inventory
* Use the same purchase and search functionality as regular users
* Admin controls remain hidden from regular users

The frontend role check controls the user interface only. All sensitive authorization is enforced again by the FastAPI backend using the user record stored in PostgreSQL.

## Technology Stack

### Backend

* Python 3.13
* FastAPI
* SQLAlchemy
* PostgreSQL
* Alembic
* Pydantic
* PyJWT
* Argon2 password hashing
* pytest
* pytest-cov

### Frontend

* React 19
* JavaScript
* HTML5
* Tailwind CSS 4
* Vite
* Vitest
* React Testing Library
* ESLint

## Architecture

```text
React SPA
   |
   | HTTP + JWT
   v
FastAPI routers
   |
   v
Service layer
   |
   v
SQLAlchemy
   |
   v
PostgreSQL
```

The application uses separate development and test PostgreSQL databases. Tests do not rely on an in-memory database.

## Project Structure

```text
car-dealership/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── exceptions.py
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── seed_admin.py
│   ├── tests/
│   ├── alembic.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── test/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── screenshots/
│   ├── backend-test-report.txt
│   └── frontend-test-report.txt
├── PROMPTS.md
└── README.md
```

## Prerequisites

Install the following:

* Python 3.13+
* PostgreSQL
* Node.js 20+
* npm
* Git

The commands below use Windows PowerShell.

## Local Setup

### 1. Clone the repository

```powershell
git clone https://github.com/adithakur22/car-dealership.git
cd car-dealership
```

### 2. Create the PostgreSQL databases

Open PostgreSQL:

```powershell
cd "C:\Program Files\PostgreSQL\18\bin"
.\psql.exe -U postgres -h localhost
```

Create the application role and databases:

```sql
CREATE ROLE dealership_app WITH LOGIN PASSWORD 'replace_with_your_password';
CREATE DATABASE dealership_dev OWNER dealership_app;
CREATE DATABASE dealership_test OWNER dealership_app;
\q
```

If the role or databases already exist, do not create them again.

### 3. Create the Python environment

From the project root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
```

### 4. Configure backend environment variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://dealership_app:replace_with_your_password@localhost:5432/dealership_dev
TEST_DATABASE_URL=postgresql+psycopg://dealership_app:replace_with_your_password@localhost:5432/dealership_test
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

Generate a JWT secret with:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Never commit `.env` or real credentials.

### 5. Apply database migrations

```powershell
cd backend
alembic upgrade head
alembic current
```

### 6. Create an administrator

From the `backend` directory:

```powershell
python -m app.seed_admin
```

Enter an email and a password containing at least eight characters. If the email already belongs to a regular user, the command promotes that account to administrator and updates its password.

### 7. Start the backend

```powershell
python -m uvicorn app.main:app --reload
```

The API is available at:

* API: `http://localhost:8000`
* Swagger documentation: `http://localhost:8000/docs`

### 8. Install and start the frontend

Open another PowerShell terminal:

```powershell
cd path\to\car-dealership\frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend defaults to `http://localhost:8000` for API requests. A different backend can be configured with:

```env
VITE_API_URL=http://localhost:8000
```

## API Endpoints

All vehicle endpoints require a valid Bearer token. Administrator-only endpoints also verify the user’s role from PostgreSQL.

| Method   | Endpoint                      | Access        | Description                    |
| -------- | ----------------------------- | ------------- | ------------------------------ |
| `POST`   | `/api/auth/register`          | Public        | Register a user                |
| `POST`   | `/api/auth/login`             | Public        | Authenticate and receive a JWT |
| `GET`    | `/api/vehicles`               | Authenticated | List all vehicles              |
| `GET`    | `/api/vehicles/search`        | Authenticated | Search and filter vehicles     |
| `POST`   | `/api/vehicles`               | Admin         | Add a vehicle                  |
| `PUT`    | `/api/vehicles/{id}`          | Admin         | Update a vehicle               |
| `DELETE` | `/api/vehicles/{id}`          | Admin         | Delete a vehicle               |
| `POST`   | `/api/vehicles/{id}/purchase` | Authenticated | Purchase one unit              |
| `POST`   | `/api/vehicles/{id}/restock`  | Admin         | Increase stock                 |

The search endpoint accepts:

* `make`
* `model`
* `category`
* `min_price`
* `max_price`

## Testing

### Backend

Backend tests use the PostgreSQL test database:

```powershell
cd backend
python -m pytest -v
```

Generate coverage:

```powershell
python -m pytest -v --cov=app --cov-report=term-missing --cov-report=html
```

Current result: **30 backend tests passing**.

[View the backend test report](docs/backend-test-report.txt)

### Frontend

```powershell
cd frontend
npm test
npm run lint
npm run build
```

Current result: **13 frontend tests passing**, ESLint passing, and production build passing.

[View the frontend test report](docs/frontend-test-report.txt)

## Test-Driven Development

The application was developed through small Red-Green-Refactor cycles:

1. Write a failing test describing the next behavior.
2. Run the test and confirm the expected failure.
3. Implement the minimum behavior needed.
4. Run the focused and complete test suites.
5. Refactor while keeping tests green.
6. Commit Red and Green stages with descriptive messages.

The commit history demonstrates this progression across authentication, authorization, inventory operations, purchasing, restocking, and frontend interactions.

Important test cases include:

* Duplicate registration rejection
* Invalid login rejection
* JWT validation and expiration
* Role included in login tokens
* Protected vehicle access
* Admin authorization
* Case-insensitive searching
* Price-range searching
* Atomic stock reduction
* Out-of-stock rejection
* Restocking
* Login and registration interactions
* JWT storage
* Inventory rendering
* Search and category filtering
* Disabled out-of-stock purchase controls
* Admin add, update, delete, and restock flows

## Screenshots

### Welcome screen

![DriveDeck welcome screen](docs/screenshots/welcome-screen.png)

### User inventory

![User vehicle inventory](docs/screenshots/user-inventory.png)

### Administrator inventory

![Administrator vehicle inventory](docs/screenshots/admin-inventory.png)

### Add vehicle form

![Administrator add vehicle form](docs/screenshots/add-vehicle-form.png)

## Security Decisions

* Passwords are hashed using Argon2 and are never stored as plain text.
* JWTs expire after a configurable period.
* Protected requests require a Bearer token.
* Administrator authorization is verified against PostgreSQL.
* Public registration always creates a regular user.
* Administrator creation is handled by a local CLI command.
* Secrets and environment files are ignored by Git.
* Vehicle purchasing uses a database-side stock condition to prevent stock from becoming negative.

For a production deployment, JWT storage should be moved from browser `localStorage` to secure, HTTP-only cookies and HTTPS should be enforced.

## My AI Usage

### AI tool used

I used **ChatGPT by OpenAI** throughout the project.

### How I used AI

I used ChatGPT as a development assistant for:

* Comparing suitable technology stacks for the assignment
* Selecting FastAPI, PostgreSQL, React, and Tailwind CSS
* Breaking the project into small TDD cycles
* Drafting initial failing tests
* Explaining FastAPI, SQLAlchemy, Alembic, React, and Vitest concepts
* Reviewing errors and tracebacks
* Diagnosing test failures and outdated mocks
* Designing the frontend component structure
* Improving validation, loading states, and error feedback
* Identifying the missing role claim in JWTs
* Preparing setup instructions and project documentation

AI-assisted commits include a `Co-authored-by` trailer to make this collaboration visible in the Git history.

### My responsibility

I manually:

* Created and configured the PostgreSQL databases
* Ran every migration
* Executed failing and passing tests
* Reviewed and typed the implementation
* Verified API behavior through the real frontend and backend
* Tested regular-user and administrator flows
* Investigated errors using browser and terminal output
* Decided which suggested changes to keep or reject
* Validated the final application end to end

The source code was developed specifically for this assignment and was not copied from another repository.

### Reflection

AI significantly reduced the time required to learn unfamiliar tools and diagnose errors. The most useful part was not simply receiving code, but using the explanations and tests to understand how requests move from React through FastAPI and SQLAlchemy to PostgreSQL.

AI suggestions still required verification. Several issues—such as a stale frontend API mock, number-input formatting, missing scaffold files, and the absent JWT role claim—were found by running the code and examining actual failures. This reinforced that AI output should be treated as a proposal that must be tested and reviewed, not as automatically correct code.

The project improved my understanding of TDD, authentication, role-based authorization, database migrations, API integration, and full-stack debugging.

The complete AI conversation is documented in [PROMPTS.md](PROMPTS.md).

## Possible Improvements

* Deploy the frontend and backend
* Use secure HTTP-only cookies
* Add pagination for large inventories
* Move frontend filtering to the backend search endpoint
* Add vehicle images
* Add refresh tokens
* Add end-to-end browser tests
* Add continuous integration with GitHub Actions

## License

This project was created as a technical assessment and learning exercise.
