# Use Node.js 20 LTS as the base image
FROM node:20.13.1-slim AS base

# Install curl and other required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install production dependencies first for better layer caching
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM base AS runner

# Install PM2 process manager
RUN npm install -g pm2

# Create a non-root user and switch to it
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Create app directory and set permissions
RUN mkdir -p /home/nodejs/app && \
    chown -R nodejs:nodejs /home/nodejs && \
    chmod -R 755 /home/nodejs

# Set home directory for nodejs user
ENV HOME=/home/nodejs

# Set non-sensitive environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_OPTIONS="--max-http-header-size=16384"

# Set default environment variables (sensitive ones will be overridden at runtime)
ENV MONGODB_URI="" \
    JWT_EXPIRES_IN="30d" \
    SMTP_HOST="smtp.sendgrid.net" \
    SMTP_PORT=587 \
    SMTP_USER="apikey" \
    FROM_EMAIL="info@avalance-resources.online" \
    TO_EMAIL="avalancetechpartner@gmail.com" \
    RATE_LIMIT_WINDOW="1hr" \
    RATE_LIMIT_MAX_REQUESTS=100

# Create a directory for runtime secrets
RUN mkdir -p /run/secrets

# Create a script to load secrets from files if they exist
RUN echo '#!/bin/sh\nset -e\n\n# Load secrets from files if they exist\nif [ -f /run/secrets/jwt_secret ]; then\n  export JWT_SECRET=$(cat /run/secrets/jwt_secret)\nfi\n\nif [ -f /run/secrets/sendgrid_api_key ]; then\n  export SENDGRID_API_KEY=$(cat /run/secrets/sendgrid_api_key)\nfi\n\nif [ -f /run/secrets/smtp_pass ]; then\n  export SMTP_PASS=$(cat /run/secrets/smtp_pass)\nfi\n\n# Execute the command\nexec "$@"' > /app/load-secrets.sh \
    && chmod +x /app/load-secrets.sh

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /home/nodejs/.pm2/logs /home/nodejs/.pm2/modules /home/nodejs/.pm2/pids \
    && touch /app/.env \
    && chown -R nodejs:nodejs /app /home/nodejs/.pm2 \
    && chmod -R 755 /home/nodejs/.pm2

# Copy necessary files with proper permissions
COPY --from=deps /app/node_modules/ ./node_modules/
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs server.js .
COPY --chown=nodejs:nodejs routes/ ./routes/
COPY --chown=nodejs:nodejs models/ ./models/
COPY --chown=nodejs:nodejs utils/ ./utils/
COPY --chown=nodejs:nodejs public/ ./public/

# Switch to non-root user and set working directory
USER nodejs
WORKDIR /home/nodejs/app

# Set PM2 home directory
ENV PM2_HOME=/home/nodejs/.pm2

# Expose the application port
EXPOSE 3000

# Health check (checks both HTTP server and MongoDB connection)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Set the working directory and command
WORKDIR /app

# Create a simple start script
RUN echo '#!/bin/sh\n\n# Start the application with PM2\nexec pm2-runtime start server.js' > /app/start.sh && \
    chmod +x /app/start.sh

# Set the entrypoint to our start script
ENTRYPOINT ["/app/start.sh"]