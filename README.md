
# Next Blog Starter

A simple **Blog Application Starter Pack** built with **TypeScript, Express.js**.  
This project is designed for the **Next Level Web Development Bootcamp** to help learners practice Prisma hands-on by building a blog platform.

---

## Features
- TypeScript + Express.js setup
- Modular project structure
- Environment configuration with `dotenv`
- Ready to extend with blog modules (Posts, Users, etc.)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Apollo-Level2-Web-Dev/next-blog-starter.git
cd next-blog-starter
```

Install dependencies:

```bash
# using npm
npm install

# using yarn
yarn install

# using pnpm
pnpm install
```

Setup environment variables:

```bash
cp .env.example .env
```

Run the development server:

```bash
# using npm
npm run dev

# using yarn
yarn dev

# using pnpm
pnpm dev
```

---

## Folder Structure

```
Prisma-Blog/
│── node_modules/          # Dependencies
│── src/
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   ├── config/            # Environment & configuration files
│   └── modules/           # Application modules (posts, users, etc.)
│── package.json           # Project metadata & scripts
│── pnpm-lock.yaml         # Lockfile (pnpm)
│── tsconfig.json          # TypeScript configuration
│── README.md              # Documentation
```

---

## Scripts

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

---

## Learning Objective

This starter pack is part of the **Next Level Web Development Bootcamp** curriculum.
By using this project, students will learn how to:

* Connect a Node.js app with Prisma ORM
* Build modular APIs
* Manage environment variables
* Structure scalable backend projects

## 49-1 Clone Starter Project and Run

- clone the repo and setup
- lets install prisma

[prisma with postgres](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres)

```
npm install prisma typescript tsx @types/node --save-dev

```

```
npx prisma init
```

- set the env from here

[env](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)

## 49-2 Setup Prisma in Starter Project

- install the prisma client as we have not migrated yet for t5his project

```
npm install @prisma/client
```

- still not auto suggestion coming ?

```
npx prisma generate
```

- src -> config -> db.ts (this is the prisma client configuration)

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

- src -> server.ts

```ts
async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Database Is Connected");
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1);
  }
}
async function startServer() {
  try {
    await connectToDB();
    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}
```

```ts
import http, { Server } from "http";
import app from "./app";
import dotenv from "dotenv";
import { prisma } from "./config/db";

dotenv.config();

let server: Server | null = null;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Database Is Connected");
  } catch (error) {
    console.log("Database Db Connection Failed");
    process.exit(1);
  }
}
async function startServer() {
  try {
    await connectToDB();
    server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

    handleProcessEvents();
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal: string) {
  console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("✅ HTTP server closed.");

      try {
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}

// Start the application
startServer();
```