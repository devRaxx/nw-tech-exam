# NW Tech Exam

A full-stack web application built with FastAPI, PostgreSQL(deployed in [NeonDB](https://neon.tech/)) and Next.js.

## 🚀 Features

- **Backend (FastAPI)**

  - RESTful API architecture
  - JWT-based authentication
  - PostgreSQL database with SQLAlchemy ORM
  - Alembic database migrations
  - Environment-based configuration
  - Data seeding

- **Frontend (Next.js)**
  - Modern React-based UI
  - Server-side rendering
  - Responsive design with Tailwind CSS
  - Cookie-based authentication
  - React Icons integration

## 🛠️ Tech Stack

### Backend

- FastAPI 0.109.2
- SQLAlchemy 2.0.27
- PostgreSQL
- Alembic
- Python 3.x

### Frontend

- Next.js 15.3.2
- React 19.0.0
- Tailwind CSS
- ESLint
- React Icons

## 📋 Prerequisites

- Python 3.x
- Node.js (Latest LTS version)
- PostgreSQL
- Git

## 🔧 Installation

1. Backend Setup
to build the docker container
```bash
cd backend
docker build -t nw-tech-exam .
```
to run the docker container
```bash
docker run --name nw-tech-exam -p 8000:8000 nw-tech-exam
```

2. Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

1. Backend Environment Variables
   Place the `.env` file in the backend directory:

2. Frontend Environment Variables
   Place the `.env.local` file in the frontend directory:

```
I will be attaching the .env file in my email
```

## 🚀 Running the Application

1. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

2. Start the Frontend

```bash
cd frontend
npm run dev
```

3. Seeding Data

To seed the database with initial data:

1. Prepare your CSV files:

   - Place `users.csv` and `posts.csv` in the `backend/app/scripts` directory
   - Ensure your CSV files have the correct column headers matching your database schema

2. Run the seeding script:
make sure docker is running
```bash
docker container exec nw-tech-exam sh -c "python seed_from_csv.py"
```

Note: Make sure your database is properly migrated before seeding data.

4. Migrating Data

To run database migrations using Alembic:

```bash
cd backend
# Create a new migration
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head

# To rollback one migration
alembic downgrade -1

# To rollback all migrations
alembic downgrade base
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📚 API Documentation

The API documentation is available at `/docs` when running the backend server. It provides:

- Interactive API documentation
- Request/response examples
- Authentication requirements
- Schema definitions
