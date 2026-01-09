# OX GROUP NestJS test task

## Setup
```bash
docker compose up -d
npm i
cp .env.example .env
npm run prisma:migrate
npm run prisma:generate
npm run start:dev
```

Server: `http://localhost:3000`

## Endpoints

### 1) Login (create user if not exists)
`POST /auth/login`

Body:
```json
{ "email": "test@mail.com" }
```

Response returns generated OTP (no real sending).

### 2) Verify OTP (get JWT)
`POST /auth/verify`

Body:
```json
{ "email": "test@mail.com", "otp": "123456" }
```

### 3) Register company (OX token + subdomain)
`POST /register-company`

Auth: Bearer JWT from step 2

Body:
```json
{ "token": "Bearer xyz", "subdomain": "demo" }
```

It calls OX `/profile` to validate the given token.

- if company doesn't exist → create company, user becomes `ADMIN`
- if company exists → user becomes `MANAGER` and attaches to the company

### 4) Delete company
`DELETE /company/:id`

Auth: Bearer JWT

Only `ADMIN` who created this company can delete it.

### 5) Get products

> Note: company first-creator becomes **ADMIN** and cannot use /products. To test /products, create another user (login/verify) and call /register-company with the same subdomain → it becomes **MANAGER**.

`GET /products?page=1&size=10`

Auth: Bearer JWT

Only `MANAGER`. `size` > 20 -> 400.

Uses user's attached company `subdomain` + stored OX token to call OX `/variations` and forwards `page/size`.
