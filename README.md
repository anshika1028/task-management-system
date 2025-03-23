# 🧠 Task Management System

A full-stack task management system built using Angular + Node.js with PostgreSQL.

## 📦 Repositories

- **Frontend UI** – `task-manager-ui`
- **Backend Server** – `task-manager-server`

## 📂 Monorepo Structure

```
task-manager/
├── task-manager-ui/           # Angular frontend
├── task-manager-server/       # Node.js backend
├── api-specs.md               # API specs
├── json-contract.txt          # Contract between UI ↔ API
├── assigment.md               # Project requirements
├── package.json
└── pnpm-workspace.yaml        # PNPM monorepo workspace
```

## ⚙️ Setup

### Prerequisites:

- Node.js >= 18.x
- PNPM (`npm install -g pnpm`)
- Docker (for containerization)

### Install All Workspaces

```bash
pnpm install
```

## 🐳 Run Fullstack with Docker

```bash
docker-compose -f task-manager-server/docker-compose.yml up --build
```

## 📖 Documentation

- API Spec → [`api-specs.md`](./api-specs.md)
- JSON Contracts → [`json-contract.txt`](./json-contract.txt)
