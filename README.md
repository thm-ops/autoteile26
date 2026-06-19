# autoteile26

[Discord](https://discord.gg/Ktd3vjM4ud)

--- 
- [Port Mapping](#port-mapping)
- [Database](#database)
- [Development](#development) 
- [Production](#production) 
- [Docker Debugging & Diagnostics](#docker-debugging--diagnostics)
- [Docker Compose Lifecycle Overview](#docker-compose-lifecycle-overview) 
- [PayPal configuration](#paypal-configuration) 


---
## Requirements

    Node ^24
    NPM ^11

---

## Port Mapping

Both development and production containers run internally on port `3000`.

Different host ports are used to allow both environments to run in parallel without port conflicts:

| Environment                      | Host Port | Container Port |
|----------------------------------|-----------|----------------|
| Development (Next.js)            | `3001`    | `3000`         |
| Production (Next.js)             | `3002`    | `3000`         |
| Development (Nest.js)            | `8080`    | `3000`         |
| Development (Nest.js) - Debugger | `9229`    | `9229`         |
| Production (Nest.js)             | `8088`    | `3000`         |
| Development (PostgreSQL)         | `5433`    | `5432`         |

Examples:

- Development → http://localhost:3001
- Production → http://localhost:3002

Docker handles the port forwarding automatically through Docker Compose port mappings.

---

## Database
The development environment includes a PostgreSQL container that starts
automatically with the development stack.

- The application connects to the database over the Docker Compose network
  using the service name `db-dev` as host (not `localhost`).
- Credentials and the connection string are defined in `.env` / `.env.default`
  (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`).
- Database data is persisted in a named volume and survives container restarts.

The database is exposed on host port `5433` (see [Port Mapping](#port-mapping)),
so you can also connect from the host, e.g. with a GUI client.

---


# Development

## Installing dependencies 
Install dependencies and create the local environment file:

```bash
npm install
npm run setup
```

## Start the Development Environment

```bash
npm run dev
```

or directly via Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up --build -d
npm run build --workspace=@autoteile26/web --if-present
```

## Clean projects

```bash
npm run clean
```

After exectution following URL will be available

* Web [http://localhost:3000](http://localhost:3000)

---

## Restart Stopped Development Containers

```bash
npm run start:dev
```

or:

```bash
docker compose -f docker-compose.dev.yml start
```

---

## Stop Development Containers

Stops the running containers while preserving them.

```bash
npm run stop:dev
```

or:

```bash
docker compose -f docker-compose.dev.yml stop
```

---

## Remove Development Containers

Removes containers and Docker Compose networks completely.

```bash
npm run down:dev
```

or:

```bash
docker compose -f docker-compose.dev.yml down
```

---

# Production

## Start the Production Environment

```bash
npm run prod
```

or directly via Docker Compose:

```bash
docker compose -f docker-compose.prod.yml up --build
```

---

## Restart Stopped Production Containers

```bash
npm run start:prod
```

or:

```bash
docker compose -f docker-compose.prod.yml start
```

---

## Stop Production Containers

Stops the running containers while preserving them.

```bash
npm run stop:prod
```

or:

```bash
docker compose -f docker-compose.prod.yml stop
```

---

## Remove Production Containers

Removes containers and Docker Compose networks completely.

```bash
npm run down:prod
```

or:

```bash
docker compose -f docker-compose.prod.yml down
```

---

## Production Logs

```bash
docker logs -f autoteile26-web-prod
```

> The production image uses a distroless runtime image.
> Therefore, no shell such as `sh` or `bash` is available.
> Shell-based debugging is only available in the development container.

---

# Docker Debugging & Diagnostics

## View Container Logs

```bash
docker logs <container-name>
```

Example:

```bash
docker logs autoteile26-app-1
```

Follow logs in real time:

```bash
docker logs -f <container-name>
```

---

## Inspect Container Information

```bash
docker inspect <container-name>
```

---

## Open a Shell Inside the Development Container

```bash
docker exec -it <container-name> sh
```

Example:

```bash
docker exec -it autoteile26-app-1 sh
```

---
## Inspect the Database
Check whether the database is accepting connections:
```bash
docker exec -it autoteile26-db-dev pg_isready -U autoteile26
```
Open a `psql` session:
```bash
docker exec -it autoteile26-db-dev psql -U autoteile26 -d autoteile26
```

---

# Docker Compose Lifecycle Overview

| Command | Description |
|---|---|
| `up --build` | Builds and starts the containers |
| `start` | Starts previously stopped containers |
| `stop` | Stops containers without removing them |
| `down` | Removes containers and Docker Compose networks |

---

# Exit or Detach from a Container

Exit the shell normally:

```bash
exit
```

Detach from an attached container session without stopping the container:

```text
CTRL + P
CTRL + Q
```


---
# PayPal configuration

PayPal JavaScript SDK via `@paypal/react-paypal-js`

### Where to get the needed credentials:
1. Log in to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox)
2. Select **Sandbox** in the top left (sandbox is used for testing)
3. Click on **Apps & Credentials**
4. Open **Default Application** or create new REST API app
5. There you will see the API credentials. Copy them and paste them into `.env`.


| PayPal value  | '.env' value                   | Meaning                                                                                                                                     |
|---------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| Client ID     | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Public Client ID used by the frontend to load PayPal JavaScript SKD and render PayPal Components (e.g. buttons)                             |
| Client ID     | `PAYPAL_CLIENT_ID`             | Client ID used by the backend together with the secret (e.g. create PayPal order).                                                          |
| Client Secret | `PAYPAL_CLIENT_SECRET`         | PayPal API secret. Only used in the backend. Do not expose this value in the frontend.                                                      |
| REST API URL  | `PAYPAL_BASE_URL`              | PayPal REST API URL for backend requests. Use `https://api-m.sandbox.paypal.com` for testing and `https://api-m.paypal.com` for production. |




---