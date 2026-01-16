# Backend Setup Instructions for Cloudflare Workers

## Quick Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Create KV Namespaces
```bash
# Create production KV namespaces
npm run setup-kv

# Create preview KV namespaces for development
npm run setup-kv:preview
```

### 3. Update wrangler.toml
After running the KV setup commands, update the KV namespace IDs in `wrangler.toml` with the actual IDs returned by the commands.

### 4. Set Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Set SendGrid API key as a secret
wrangler secret put SENDGRID_API_KEY

# Optional: Set JWT secret
wrangler secret put JWT_SECRET
```

### 5. Local Development
```bash
npm run dev
```

### 6. Deploy to Production
```bash
npm run deploy
```

## Environment Variables Required

- `SENDGRID_API_KEY`: Your SendGrid API key for email notifications
- `FROM_EMAIL`: Sender email address (configured in wrangler.toml)
- `ADMIN_EMAIL`: Admin email to receive notifications (configured in wrangler.toml)
- `ENVIRONMENT`: Development or production (configured in wrangler.toml)

## API Endpoints

- `GET /` - Main page
- `GET /faq` - FAQ page  
- `GET /services` - Services page
- `GET /assets/*` - Static assets
- `POST /api/contact` - Contact form submission
- `POST /api/pricing-request` - Pricing request submission
- `GET /api/health` - Health check
- `GET /api/admin/contacts` - Admin endpoint to view contacts

## Features Implemented

✅ Complete Cloudflare Worker with routing
✅ Static asset serving
✅ Contact form with email notifications
✅ Pricing request handling
✅ KV storage for data persistence
✅ CORS support
✅ Error handling and logging
✅ Health check endpoint
✅ Admin endpoint for contact management

## Testing

Test the backend by:
1. Starting the development server (`npm run dev`)
2. Visiting `http://localhost:8787/api/health` - should return healthy status
3. Submitting contact forms through the frontend
4. Checking email notifications (if SendGrid configured)
