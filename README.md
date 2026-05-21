# autoteile26

[Discord](https://discord.gg/Ktd3vjM4ud)

--- 

## Development

Start the application in development mode:

```bash
npm run dev
```

Alternatively, start the development environment directly using Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Stop the development containers:

```bash
npm run stop:dev
```

or:

```bash
docker compose -f docker-compose.dev.yml down
```

---

## Production

Build and start the production environment:

```bash
npm run prod
```

Alternatively, start the production environment directly using Docker Compose:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Stop the production containers:

```bash
npm run stop:prod
```

or:

```bash
docker compose -f docker-compose.prod.yml down
```

View the production logs:

```bash
docker logs -f autoteile26-web-prod
```

> Note:
> The production image uses a distroless runtime image.
> Therefore, it does not include a shell such as `sh` or `bash`.
> Shell-based debugging is only available in the development container.

---

## Docker Debugging & Diagnostics

### View Container Logs

Display the logs of a running container:

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

### Inspect Container Information

Display detailed metadata and runtime information about a container:

```bash
docker inspect <container-name>
```

---

### Access the Development Container Shell

Open an interactive shell inside the development container:

```bash
docker exec -it <container-name> sh
```

Example:

```bash
docker exec -it autoteile26-app-1 sh
```
---

### Exit or Detach from a Container

Exit the shell normally:

```bash
exit
```

Detach from an attached container session without stopping the container:

```text
CTRL + P
CTRL + Q
```