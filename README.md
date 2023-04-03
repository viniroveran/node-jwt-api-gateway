# node-jwt-api-gateway
A simple Node.js API Gateway + JWT

It also contains two fake APIs, `api-fake-cars` and `api-fake-games`

## Requirements
NodeJS `16.20.0`

## Configuring environment variables
```bash
cp .env.example .env
cp api-fake-cars/.env.example api-fake-cars/.env
cp api-fake-games/.env.example api-fake-games/.env
```

Then configure the `SECRET` in `.env` with something secure (25+ characters)

## How to run

First, start each fake API individually

```bash
cd api-fake-cars
npm install && npm start
```

```bash
cd api-fake-games
npm install && npm start
```

Then, run the API Gateway

```bash
npm install && npm start
```