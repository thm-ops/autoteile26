# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:24 AS builder

# Set working directory
WORKDIR /app

# Copy all files to /app folder
COPY . .

# Install dependencies using Docker cache mount
RUN npm ci

# Build standalone
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production runtime
# -----------------------------------------------------------------------------
FROM node:24 AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy the complete built application
COPY --from=builder /app/packages/apps/web/.next/standalone /app
COPY --from=builder /app/packages/apps/web/.next/static /app/packages/apps/web/.next/static
COPY --from=builder /app/packages/apps/web/public /app/packages/apps/web/public

# Start Next.js without npm
ENTRYPOINT ["node", "packages/apps/web/server.js"] 
