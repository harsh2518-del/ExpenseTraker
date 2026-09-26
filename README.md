# Expanse

Production-oriented expense tracker foundation with a React frontend and Flask API backed by PostgreSQL.

## Project structure

```text
expanse/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py
│   │   ├── config.py
│   │   ├── extensions.py
│   │   ├── __init__.py
│   │   └── models/
│   │       ├── __init__.py
│   │       └── user.py
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── docker-compose.yml
└── .gitignore
```

## Local development

### 1. Start PostgreSQL

```bash
docker compose up -d db
```

### 2. Start the Flask API

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

The API runs at `http://localhost:5000`.

### 3. Start the React app

```bash
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API endpoints

- `GET /api/health` - service and database connectivity check
- `GET /api/v1/status` - API metadata

The database layer is ready for Flask-Migrate migrations as domain models are added.
