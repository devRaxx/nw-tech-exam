# NW Tech Exam

A full-stack web application built with FastAPI, PostgreSQL and Next.js.

## 🚀 Features

- **Backend (FastAPI)**

  - RESTful API architecture
  - JWT-based authentication
  - PostgreSQL database with SQLAlchemy ORM
  - Alembic database migrations
  - Environment-based configuration

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

1. Clone the repository

```bash
git clone https://github.com/yourusername/nw-tech-exam.git
cd nw-tech-exam
```

2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. Frontend Setup

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

or

```bash
cd frontend
npm run build
npm run start
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
