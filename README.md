This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Getting Started

## Node version
Tested on v18.20.5

## Envs

For each of packages/api, packages/front
1. Copy .env.example to .env
2. Fill in the variables for your setup
3. For db envs, you need db running, which is covered in the next section.

## Database

This application uses PostgreSQL as its primary database.

#### Requirements
- PostgreSQL (tested on v17.2)

#### Setup
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a new database:
   
```sql
CREATE DATABASE your_database_name;
```
3. Run migrations
```bash 
cd packages/api
npm run migration:up
```
4. Run seeds
```bash
# fron same folder
npm run seed:dev
```

## Run the app:

1. Development:
```bash
pnpm install
pnpm dev
```

2. Production
```bash
pnpm install
pnpm build
pnpm start
```

With default ports, Front-end will be available on port 3000, and Api on port 9258. You can assign another port to the api with env var, or modify front's package.json to change front's port.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
