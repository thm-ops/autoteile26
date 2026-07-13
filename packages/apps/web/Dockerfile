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

# Next.js inlines NEXT_PUBLIC_* values into the browser bundle at build time.
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL

# Build the shared workspace first so @autoteile26/shared/dist exists for the web build.
RUN npm run build:shared
RUN npm run build --workspace=@autoteile26/web

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
