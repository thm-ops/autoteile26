ARG NODE_VERSION=24-alpine
ARG DISTROLESS_NODE_IMAGE=gcr.io/distroless/nodejs24-debian12

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Production Docker image for the autoteil26 service application"

WORKDIR /packages/apps/service

COPY package-lock.json .
COPY packages/apps/service/package.json .

# https://docs.npmjs.com/cli/v11/commands/npm-ci
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# -----------------------------------------------------------------------------
# Stage 2: Build the application
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder

WORKDIR /packages/apps/service

COPY --from=deps /packages/apps/service/node_modules ./node_modules

COPY packages/apps/service .

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production runtime (Distroless)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Distroless production runtime for the autoteil26 service application"

WORKDIR /packages/apps/service

COPY --from=builder /packages/apps/service/node_modules ./node_modules
COPY --from=builder /packages/apps/service/dist ./dist
COPY packages/apps/service/healthcheck.js .

HEALTHCHECK CMD ["/nodejs/bin/node", "/packages/apps/service/healthcheck.js"]

USER node

EXPOSE 3000

ENTRYPOINT [ "node", "dist/main.js" ]
