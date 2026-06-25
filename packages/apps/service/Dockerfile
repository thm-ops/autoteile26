ARG NODE_VERSION=24-alpine

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Production Docker image for the autoteil26 service application"

WORKDIR /app

COPY . .

# https://docs.npmjs.com/cli/v11/commands/npm-ci
RUN --mount=type=cache,target=/root/.npm \
    npm ci 

# -----------------------------------------------------------------------------
# Stage 2: Build the application
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=deps /app /app

WORKDIR /app/packages/apps/service

RUN npm run build

WORKDIR /app

# -----------------------------------------------------------------------------
# Stage 3: Production runtime
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Production runtime for the autoteil26 service application"

WORKDIR /app/packages/apps/service

COPY --chown=node:node --from=builder /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/packages/apps/service/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/packages/apps/service/dist ./dist
COPY --chown=node:node packages/apps/service/healthcheck.js .

# The Alpine Node image provides `node` on PATH; /nodejs/bin/node is Distroless-only.
HEALTHCHECK --interval=5s --timeout=3s --start-period=20s --retries=10 CMD ["node", "healthcheck.js"]

USER node

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]