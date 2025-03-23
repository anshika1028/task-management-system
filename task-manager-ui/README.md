# Task Manager UI

This is the frontend UI for the Task Manager project. It is built using **Angular 19**, **MobX**, and styled using the **Carbon Design System** and **Tailwind CSS**.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## 🧰 Tech Stack

- Angular 19
- MobX for state management
- Carbon Design System
- Tailwind CSS
- TypeScript
- PNPM (Package Manager)

## 📁 Project Structure

```
task-manager-ui/
├── src/
│   ├── app/                # Angular components, pages, and logic
│   │   ├── components/     # Shared reusable components
│   │   ├── pages/          # Feature views like TaskList, TaskDetail
│   │   ├── stores/         # MobX state management
│   │   └── app.module.ts   # Main app module
│   ├── assets/             # Static assets like images
│   └── index.html          # Root HTML file
├── public/                 # Public static files
├── angular.json            # Angular CLI config
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── package.json
└── README.md
```

## 🚀 Installation and Running

1. **Clone or unzip the repository:**

   ```bash
   git clone <repository_url>
   cd task-manager-ui
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the application:**

   ```bash
   pnpm start
   ```

4. **Open the application in your browser:**

   ```
   http://localhost:4200/
   ```

## 🧪 Testing

To execute unit tests using [Karma](https://karma-runner.github.io):

```bash
pnpm test
```

## 🖼 Screens

- Landing Page (Login register)
- Task List Page
- Task Details Page
- Create/Edit Task Page
