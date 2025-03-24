[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/RXbf2uu5Yme2ixNe75Q8ut/HTpvVactqkLXhgy63ab1XC/tree/main.svg?style=svg&circle-token=CCIPRJ_2n5cdJhaPEbpu4G2ZsXwuc_860a4e85e9ead0d516289fc401a3caeca178c68c)](https://dl.circleci.com/status-badge/redirect/circleci/RXbf2uu5Yme2ixNe75Q8ut/HTpvVactqkLXhgy63ab1XC/tree/main)


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

### Start PostgreSQL
```
docker-compose up -d
```
### Install Backend Dependencies & Start Server
```
cd backend
npm install
npm run dev
```
### Install Frontend Dependencies & Start Angular UI

```
npm install
npm start
```

### open the app in local

```
http://localhost:4200/
```

### Install All Workspaces

```bash
npm install
```

## 🐳 Run Fullstack with Docker

```bash
docker-compose -f task-manager-server/docker-compose.yml up --build
```

## 📖 Documentation

- API Spec → [`api-specs.md`](./api-specs.md)
- JSON Contracts → [`json-contract.txt`](./json-contract.txt)
