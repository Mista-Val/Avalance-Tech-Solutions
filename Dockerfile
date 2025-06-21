# Use Node.js 20 LTS as the base image
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Install production dependencies first for better layer caching
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build stage (if needed)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If you have any build steps, uncomment the following line
# RUN npm run build

# Production stage
FROM base AS runner

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user and switch to it
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Application environment variables
ENV MONGODB_URI="" \
    JWT_SECRET="" \
    JWT_EXPIRES_IN="30d" \
    SMTP_HOST="smtp.sendgrid.net" \
    SMTP_PORT=587 \
    SMTP_USER="apikey" \
    SMTP_PASS="" \
    SENDGRID_API_KEY="" \
    FROM_EMAIL="info@avalance-resources.online" \
    TO_EMAIL="avalancetechpartner@gmail.com" \
    RATE_LIMIT_WINDOW="1hr" \
    RATE_LIMIT_MAX_REQUESTS=100 \
    NODE_OPTIONS="--max-http-header-size=16384"

# Copy necessary files with proper permissions
COPY --from=deps /app/node_modules/ ./node_modules/
RUN chown -R nodejs:nodejs /app/node_modules
COPY --chown=nodejs:nodejs package*.json ./
# Create and set permissions for .env file
RUN mkdir -p /app && \
    touch /app/.env && \
    chown -R nodejs:nodejs /app/.env

# Copy .env file if it exists in the build context
COPY --chown=nodejs:nodejs .env* /app/
# The above will fail if no .env file exists, but that's okay as we already created an empty one
COPY --chown=nodejs:nodejs server.js .
COPY --chown=nodejs:nodejs routes/ ./routes/
COPY --chown=nodejs:nodejs models/ ./models/
COPY --chown=nodejs:nodejs utils/ ./utils/
COPY --chown=nodejs:nodejs public/ ./public/

# Create necessary directories
RUN mkdir -p /app/logs \
    && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]