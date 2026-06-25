ARG NODE_VERSION=24-alpine

# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Production Docker image for the autoteil26 service application"

WORKDIR /packages/apps/service

COPY . .

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
# Stage 3: Production runtime
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

LABEL maintainer="volknichtx" \
    version="1.0" \
    environment="production" \
    description="Production runtime for the autoteil26 service application"

WORKDIR /packages/apps/service

COPY --chown=node:node --from=builder /packages/apps/service/node_modules ./node_modules
COPY --chown=node:node --from=builder /packages/apps/service/dist ./dist
COPY --chown=node:node packages/apps/service/healthcheck.js .

# The Alpine Node image provides `node` on PATH; /nodejs/bin/node is Distroless-only.
HEALTHCHECK CMD ["node", "healthcheck.js"]

USER node

EXPOSE 3000

ENTRYPOINT [ "node", "dist/main.js" ]
