# Task Manager Server

This is the backend server for the Task Manager project. It is built with **Node.js**, **Express**, **TypeScript**, and uses **PostgreSQL** as the database. The server supports RESTful APIs for task operations.

## 📦 Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- Docker & Docker Compose
- CircleCI (CI/CD)
- Jest (Unit Testing)
- PNPM (Package Manager)

## 📁 Project Structure

```
task-manager-server/
├── coverage/               # Test coverage reports
├── src/                    # Source code
│   ├── controllers/        # Route handler logic
│   ├── middlewares/        # Custom Express middleware
│   ├── models/             # DB models and ORM schema
│   ├── routes/             # Express routes
│   ├── services/           # Business logic and helpers
│   └── index.ts            # App entry point
├── Dockerfile              # Docker build file
├── docker-compose.yml      # For local multi-container setup
├── jest.config.js          # Jest testing config
├── package.json
├── tsconfig.json
└── .env                    # Environment variables
```

## 🚀 Getting Started

### 1. Clone & Navigate

```bash
git clone <repo-url>
cd task-manager-server
```

### 2. Install Dependencies
Before installing make sure you have node and pnpm installed globally already

```bash
pnpm install
```

### 3. Setup Environment
create db in postgress

```
CREATE DATABASE task_manager;
```



Create a `.env` file in the root directory with necessary environment variables.

```
PORT=3000
JWT_SECRET=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=5432
```

### 4. Run Dev Server

```bash
pnpm start
```

### 5. Setup public holiday table in postgress

```
INSERT INTO public_holidays ("holiday_name", "date", "createdAt", "updatedAt") VALUES
('New Year''s Day', '2025-01-01', NOW(), NOW()),
('Chinese New Year', '2025-01-29', NOW(), NOW()),
('Good Friday', '2025-04-18', NOW(), NOW()),
('Labour Day', '2025-05-01', NOW(), NOW()),
('Vesak Day', '2025-05-12', NOW(), NOW()),
('Hari Raya Puasa', '2025-03-31', NOW(), NOW()),
('Hari Raya Haji', '2025-06-07', NOW(), NOW()),
('National Day', '2025-08-09', NOW(), NOW()),
('Deepavali', '2025-10-20', NOW(), NOW()),
('Christmas Day', '2025-12-25', NOW(), NOW());
```

### 6. Test the application on swagger : open below in the browser
```
http://localhost:3000/api-docs/
```

### 6. Run with Docker

```bash
docker-compose up --build
```

## 🧪 Running Tests

```bash
pnpm test
```

## 📜 API Docs

See `api-specs.md` and Swagger documentation.
