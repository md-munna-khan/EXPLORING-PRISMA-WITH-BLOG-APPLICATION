
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
## 49-3 Requirement Analysis (User, Post)

- there is a bug in connecting the database
- as we have nothing inside schema and we didn't do any migration so the bridge is not created for this reason this error is coming
- prisma -> prisma.schema (create user schema)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id Int @id @default(autoincrement())
}
```

- migrate it

```
npx prisma migrate dev
```

- now run

```
npm run dev
```

- now this will run the server

#### Lets understand the Blog App project first


![alt text](image.png)

## 49-4 Write User and Post Models in Prisma Schema

- user and post Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int        @id @default(autoincrement())
  name       String
  email      String
  password   String?
  role       Role       @default(USER)
  phone      String
  picture    String?
  status     UserStatus @default(ACTIVE)
  isVerified Boolean    @default(false)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  thumbnail  String?
  isFeatured Boolean  @default(false)
  tags       String[]
  views      Int      @default(0)
  authorId   Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

```

- migrate it

```
npx prisma migrate dev
```

## 49-5 One-to-Many Relation in Prisma



- lets make the relation

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int        @id @default(autoincrement())
  name       String
  email      String
  password   String?
  role       Role       @default(USER)
  phone      String
  picture    String?
  status     UserStatus @default(ACTIVE)
  isVerified Boolean    @default(false)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  Posts       Post[] // relationship making
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  thumbnail  String?
  isFeatured Boolean  @default(false)
  tags       String[]
  views      Int      @default(0)
  authorId   Int
  author     User     @relation(fields: [authorId], references: [id]) // for relationship
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

```

```
npx prisma migrate dev
```

- create src -> modules -> user -> user.controller.ts , user.route.ts, user.service.ts


## 49-6 Create User in Database

- app.ts (router connected)

```ts
import compression from "compression";
import cors from "cors";
import express from "express";
import { UserRouter } from "./modules/user/user.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/user", UserRouter); // added the route

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
```

- src -> modules -> user -> user.route.ts

```ts
import express from "express";
import { UserController } from "./user.controller";
const router = express.Router();

router.post("/", UserController.createUser);

export const UserRouter = router;
```

- src -> modules -> user -> user.controller.ts

```ts
import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

export const UserController = {
  createUser,
};
```

- src -> modules -> user -> user.service.ts

```ts
import { prisma } from "../../config/db";

const createUser = async (payload: any) => {
  console.log(payload);
  console.log("Create User!");
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

export const UserService = {
  createUser,
};
```

- now hit is postman

```json
{

  "name": "munna",
  "email": "munna@example.com",
  "phone": "+8801700000003"

}
```
