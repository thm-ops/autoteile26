# autoteile26

[Discord](https://discord.gg/Ktd3vjM4ud)

--- 
- [Port Mapping](#port-mapping)
- [Development](#development) 
- [Production](#production) 
- [Docker Debugging & Diagnostics](#docker-debugging--diagnostics)
- [Docker Compose Lifecycle Overview](#docker-compose-lifecycle-overview) 

---
## Requirements

    Node ^24
    NPM ^11

---

## Port Mapping

Both development and production containers run internally on port `3000`.

Different host ports are used to allow both environments to run in parallel without port conflicts:

| Environment | Host Port | Container Port |
|---|---|---|
| Development | `3001` | `3000` |
| Production | `3002` | `3000` |

Examples:

- Development → http://localhost:3001
- Production → http://localhost:3002

Docker handles the port forwarding automatically through Docker Compose port mappings.

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

After exectution following URL will be available

* Mongo Express [http://localhost:8081](http://localhost:8081)
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