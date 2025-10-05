# MeetDrasil

## Motivation

App was created at <a href="https://hackyeah.pl/" target="_blank">Hackyeah</a> 2025 Hackathon

- Topic: Digital Volunteer Center by Miasto Kraków
- Timeframe: 04-05.10.2025, 24 hours

# AI Backend link

https://github.com/tobi303x/HAckYeah-Ai-Backend

# Tech Stack

<img alt="NEXT.JS" src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img alt="REACTJS" src="https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black"/>
<img alt="TYPESCRIPT" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white"/>
<img alt="TAILWIND" src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white"/>
<img alt="SHADCN" src="https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white"/>
<img alt="POSTGRESQL" src="https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img alt="DRIZZLE" src="https://img.shields.io/badge/Drizzle-000?style=for-the-badge&logo=Drizzle&logoColor=white"/>
<img alt="TRPC" src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white"/>

# Authors

- [@Sosek1](https://github.com/Sosek1)
- [@MSiorr](https://github.com/MSiorr)
- [@CALLmeDOMIN](https://github.com/CALLmeDOMIN)
- [@Zboro02](https://github.com/Zboro02)
- [@tobi303x](https://github.com/tobi303x)

# License

This project is licensed under [MIT](./LICENSE) license.

# Development

### Prerequisites

1. Node JS 22, version 22.14.0 or later
2. pnpm package manager ([installation guide](https://pnpm.io/installation))
   1. For people of restiance `npm install -g pnpm@latest-10`

### Installing the dependencies

Run `pnpm install` to install all the necessary dependencies for the project

### Setting up env vars

Create a new file that is not tracked by git, `.env` in the root of the project. Make sure to populate it will all the required environmental variables (example of those with corresponding values can be seen in [`.env.example`](./.env.example)). (yes, you can just copy it)

If you add a new env var to the application, please describe it in [`.env.example`](./.env.example) file as well

### Starting the development server

Run `pnpm run dev` to start a developer server at http://localhost:3000

## Working with Database

Project is using a PostgreSQL database. [`./start-database.sh`](./start-database.sh) contains an example docker-compose file for running the database locally.

### Modifying the schema

[`schema.ts`](./server/db/schema.ts) contains the schema of the database, as well as information about the providers, adapters and generators. You are free to modify the schema to suit you needs.

When you want to test if the schema you created works as expected, you can use `pnpm db:push` to update your database schema and generate prisma client, without create a new migration. Use it for prototyping until you are sure that your changes work flawlessly.

When finished, you need to make your schema changes persistant by running `pnpm db:generate` to create a new migration. Treat migrations as commits in Git - each migration should represent an unit of work.

> [!WARNING]
> Migration files should not be edited manually. Content of `drizzle/` is auto-generated and any changes to it might be overwritten.
