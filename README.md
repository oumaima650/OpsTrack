# OpsTrack - Incident Management System

Plateforme DevOps cloud-native de bout en bout (Docker, CI/CD GitHub Actions, Kubernetes, Terraform/AWS) construite autour d'une application de gestion d'incidents en microservices (NestJS + React) — projet portfolio démontrant le cycle de vie complet **Conteneurisation → Orchestration → Infrastructure as Code**.

---

## Architecture Overview

The application consists of 3 backend microservices, 1 frontend SPA, and a managed PostgreSQL database:

1. **`api-gateway` (Port 3000)**: Central API Gateway routing requests to downstream microservices. Provides aggregated health checks (`/api/health`) and OpenAPI/Swagger documentation (`/api/docs`).
2. **`incident-service` (Port 3001)**: Manages incident lifecycle (CRUD) backed by TypeORM (supports SQLite for zero-config local dev and PostgreSQL for production). Triggers notifications on incident creation or status changes.
3. **`notification-service` (Port 3002)**: Microservice with REST endpoint (`POST /notifications`) logging incident alerts.
4. **`frontend` (Port 80 / 5173)**: Modern React + Vite + TypeScript dashboard served via Nginx in production for managing incidents and monitoring system status.

---

## Project Structure

```
.
├── backend/
│   ├── api-gateway/          # NestJS API Gateway (Port 3000)
│   ├── incident-service/     # NestJS Incident CRUD Service (Port 3001)
│   └── notification-service/ # NestJS Notification Logger (Port 3002)
├── frontend/                 # React + Vite + TypeScript Dashboard (Port 80/5173)
├── docker-compose.yml        # Docker Compose orchestration (PostgreSQL + Microservices)
├── .dockerignore
├── .gitignore
└── README.md
```

---

##  How to Run with Docker (Recommended)

### Prerequisites
- **Docker Desktop** installed and running.

### 1-Command Startup
At the project root, run:

```bash
docker compose up --build
```

### Services Map

| Service | Local URL | Container Port | Description |
|---|---|---|---|
| **Frontend Dashboard** | http://localhost | `80` | React Dashboard served via Nginx |
| **API Gateway** | http://localhost:3000 | `3000` | Gateway & Swagger Docs (`/api/docs`) |
| **Incident Service** | http://localhost:3001 | `3001` | Incident CRUD REST API |
| **Notification Service** | http://localhost:3002 | `3002` | Event Notification REST Logger |
| **PostgreSQL DB** | `localhost:5432` | `5432` | Database (`opstrack_incidents`) |

---

##  How to Run Locally (Without Docker)

### Prerequisites
- **Node.js 20 LTS** (or v18+)
- **npm** (v9+)

### Step 1: Install Dependencies
```bash
# 1. Notification Service
cd backend/notification-service && npm install

# 2. Incident Service
cd ../incident-service && npm install

# 3. API Gateway
cd ../api-gateway && npm install

# 4. Frontend
cd ../../frontend && npm install
```

### Step 2: Database Setup (Zero Configuration)
By default, `incident-service` uses **SQLite** (`opstrack.sqlite`), requiring zero database setup.

To use **PostgreSQL**, update `backend/incident-service/.env`:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=opstrack_incidents
```

### Step 3: Start Services Locally (Separate Terminals)

```bash
# Terminal 1: Notification Service (Port 3002)
cd backend/notification-service && npm run start:dev

# Terminal 2: Incident Service (Port 3001)
cd backend/incident-service && npm run start:dev

# Terminal 3: API Gateway (Port 3000)
cd backend/api-gateway && npm run start:dev

# Terminal 4: Frontend (Port 5173)
cd frontend && npm run dev
```

---

##  Running Unit & Integration Tests

```bash
# Notification Service Tests
cd backend/notification-service
npm test
npm run test:e2e

# Incident Service Tests
cd backend/incident-service
npm test
npm run test:e2e

# API Gateway Tests
cd backend/api-gateway
npm test
npm run test:e2e
```
