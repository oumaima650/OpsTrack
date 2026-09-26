# OpsTrack - Incident Management System

OpsTrack is a microservices-based Incident Management application built with **NestJS**, **TypeORM**, **PostgreSQL / SQLite**, and **React (Vite)**.

---

##  Architecture Overview

The application consists of 3 backend services and 1 frontend app:

1. **`api-gateway` (Port 3000)**: Central API Gateway routing requests to downstream services. Provides aggregated health checks (`/api/health`) and OpenAPI/Swagger documentation (`/api/docs`).
2. **`incident-service` (Port 3001)**: Manages incident lifecycle (CRUD) backed by TypeORM (defaults to zero-setup SQLite, supports PostgreSQL). Triggers notifications on incident creation or status changes.
3. **`notification-service` (Port 3002)**: Microservice with REST endpoint (`POST /notifications`) logging incident alerts.
4. **`frontend` (Port 5173)**: Modern React + Vite + TypeScript dashboard for managing incidents, viewing metrics, and monitoring Gateway health.

---

##  Project Structure

```
d:/OpsTrack/
├── backend/
│   ├── api-gateway/          # NestJS API Gateway (Port 3000)
│   ├── incident-service/     # NestJS Incident CRUD (Port 3001)
│   └── notification-service/ # NestJS Notification Logger (Port 3002)
├── frontend/                 # React + Vite + TypeScript (Port 5173)
└── README.md
```

---

##  How to Run Locally (No Docker Required)

### Prerequisites
- **Node.js 20 LTS** (or v18+)
- **npm** (v9+)

---

### Step 1: Install Dependencies

```bash
# 1. Notification Service
cd backend/notification-service
npm install

# 2. Incident Service
cd ../incident-service
npm install

# 3. API Gateway
cd ../api-gateway
npm install

# 4. Frontend
cd ../../frontend
npm install
```

---

### Step 2: Database Setup (Zero Configuration)

By default, `incident-service` uses **SQLite** (`opstrack.sqlite`), requiring **zero database installation or password setup**.

If you wish to use a local **PostgreSQL** instance instead:
Open `backend/incident-service/.env` and update:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_pg_user
DB_PASSWORD=your_pg_password
DB_DATABASE=opstrack_incidents
```

---

### Step 3: Start Services Locally

Start each service in a separate terminal:

#### 1. Notification Service (Terminal 1)
```bash
cd backend/notification-service
npm run start:dev
```
*Runs on: http://localhost:3002 (Swagger: http://localhost:3002/api/docs)*

#### 2. Incident Service (Terminal 2)
```bash
cd backend/incident-service
npm run start:dev
```
*Runs on: http://localhost:3001 (Swagger: http://localhost:3001/api/docs)*

#### 3. API Gateway (Terminal 3)
```bash
cd backend/api-gateway
npm run start:dev
```
*Runs on: http://localhost:3000 (Swagger: http://localhost:3000/api/docs | Health: http://localhost:3000/api/health)*

#### 4. Frontend Dashboard (Terminal 4)
```bash
cd frontend
npm run dev
```
*Runs on: http://localhost:5173*

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
