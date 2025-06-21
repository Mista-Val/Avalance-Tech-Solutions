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

# Copy necessary files with proper permissions
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs server.js .
COPY --chown=nodejs:nodejs routes ./routes
COPY --chown=nodejs:nodejs models ./models
COPY --chown=nodejs:nodejs utils ./utils
COPY --chown=nodejs:nodejs public ./public

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