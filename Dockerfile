# Build stage
FROM node:18-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ git

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN mkdir -p dist && node scripts/build.js

# Production stage
FROM node:18-slim
WORKDIR /app

# Install production dependencies and required system packages
RUN apt-get update && apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Create directory for MongoDB certificate
RUN mkdir -p /app/config/certs

# Copy MongoDB X.509 certificate
COPY --chown=node:node config/certs/X509-cert-2936708047333089615.pem /app/config/certs/mongodb-cert.pem

# Set environment variables with defaults
ENV NODE_ENV=production \
    PORT=3000 \
    # MongoDB X.509 Authentication
    MONGODB_URI=mongodb+srv://avalance-cluster1.znxr0bl.mongodb.net/avalanche?retryWrites=true&w=majority \
    MONGODB_CERT_PATH=/app/config/certs/mongodb-cert.pem \
    # JWT Configuration
    JWT_SECRET=your_secure_jwt_secret_key_change_in_production \
    JWT_EXPIRES_IN=30d \
    # Email Configuration
    SMTP_HOST=smtp.gmail.com \
    SMTP_PORT=587 \
    SMTP_USER=your-email@gmail.com \
    SMTP_PASS=your-email-password \
    # Rate Limiting
    RATE_LIMIT_WINDOW=15m \
    RATE_LIMIT_MAX_REQUESTS=100 \
    CONTACT_FORM_LIMIT_WINDOW=1h \
    # Security
    NODE_OPTIONS=--max-http-header-size=16384

# Set proper permissions for certificate
RUN chmod 600 /app/config/certs/mongodb-cert.pem && \
    chown -R node:node /app/config/certs

# Create necessary directories
RUN mkdir -p /app/logs /app/public /app/public/assets/{css,js,images,fonts} /app/config

# Copy production dependencies and source code
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && \
    chown -R node:node /app

# Create necessary directories with correct permissions
RUN mkdir -p /app/public && \
    chown -R node:node /app

# Copy the entire public directory structure
COPY --chown=node:node public/ /app/public/

# Copy built assets from builder stage
COPY --from=builder --chown=node:node /app/dist/ /app/public/

# Ensure all files are readable
RUN chmod -R 755 /app/public

# Copy other necessary files
COPY --from=builder --chown=node:node /app/scripts /app/scripts
COPY --from=builder --chown=node:node /app/routes /app/routes
COPY --from=builder --chown=node:node /app/models /app/models
COPY --from=builder --chown=node:node /app/config /app/config
COPY --from=builder --chown=node:node /app/server.js /app/server.js

# Copy any .env file if it exists
RUN cp /app/.env* /app/ 2>/dev/null || :

# Ensure the public directory is writable for runtime
RUN chmod -R 755 /app/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { if (res.statusCode !== 200) throw new Error('Not healthy') })" || exit 1

# Run as non-root user for security
USER node

# Start command
CMD ["node", "server.js"]