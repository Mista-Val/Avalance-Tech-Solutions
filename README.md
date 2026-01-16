# 🚀 Avalance Tech Solutions

A modern IT consultation and cloud services platform built with Cloudflare Workers. The application features a responsive frontend with dynamic video backgrounds, interactive service inquiries, and a serverless backend API with KV storage.

## ✨ Features

- 🎨 Responsive web design with Bootstrap 5
- 🎬 Dynamic video backgrounds on all pages
- 💬 Interactive service inquiry modals
- ✉️ Contact form with email notifications via SendGrid
- 🌩 Serverless architecture with Cloudflare Workers
- 💾 KV storage for data persistence
- ⚡ Global CDN deployment
- 🩺 Health check endpoints
- ⚙️ Environment-based configuration
- 🔒 CORS-enabled API endpoints

## 🏗️ Project Structure

```
.
├── public/               # Static files served by Cloudflare Pages
│   ├── assets/          # Static assets (CSS, JS, images, videos, fonts)
│   ├── index.html       # Main HTML page with video background
│   ├── services.html    # Services page with video background
│   ├── faq.html        # FAQ page with video background
│   └── ...
├── src/                # Cloudflare Worker source
│   └── api-worker.js   # Main worker with API endpoints
├── wrangler.toml       # Cloudflare Workers configuration
├── .env.example        # Environment variables template
└── package.json        # Project metadata and dependencies
```

## 🚀 Prerequisites

- Node.js 16.0.0+ (LTS recommended)
- Cloudflare account (https://cloudflare.com)
- Wrangler CLI (Cloudflare Workers tool)
- SendGrid API key (for email notifications)

## 🛠️ Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Web application: http://localhost:8787
   - API endpoints: http://localhost:8787/api/*

## 🌍 Environment Variables

Create a `.env` file in the root directory by copying the example file:

```env
# Application Environment
ENVIRONMENT=development

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=info@avalance-resources.online
ADMIN_EMAIL=avalancetechpartner@gmail.com

# KV Namespace IDs (populated after setup)
CONTACT_KV_ID=contact_kv_namespace
PRICING_KV_ID=pricing_kv_namespace
```

## 🐳 Cloudflare Workers Commands

### Development
```bash
# Start local development server
npm run dev

# Create KV namespaces (one-time setup)
npm run setup-kv
npm run setup-kv:preview
```

### Deployment
```bash
# Deploy to production
npm run deploy

# Deploy to production environment
npm run deploy:prod
```

### Secrets Management
```bash
# Set SendGrid API key as secret
wrangler secret put SENDGRID_API_KEY

# Set other secrets as needed
wrangler secret put JWT_SECRET
```

## 🔄 API Endpoints

- `GET /` - Main application page
- `GET /faq` - FAQ page
- `GET /services` - Services page
- `GET /assets/*` - Static assets (CSS, JS, images, videos)
- `POST /api/contact` - Submit contact form
- `POST /api/pricing-request` - Submit pricing request
- `GET /api/health` - Health check endpoint
- `GET /api/admin/contacts` - Admin endpoint to view contacts

## 📧 Email Integration

The application integrates with SendGrid for email notifications:
- Contact form submissions
- Pricing request notifications
- HTML-formatted email templates
- Error handling for email failures

## 💾 Data Storage

Uses Cloudflare Workers KV for serverless data persistence:
- Contact submissions stored with timestamps
- Pricing requests with metadata
- Admin access to submission data
- Automatic cleanup of old entries (configurable)

## 🎬 Video Backgrounds

Dynamic video backgrounds enhance user experience:
- **Home Page**: 3D AI animation with tech overlay
- **Services Page**: Animated zoom with professional overlay
- **FAQ Page**: Subtle animation with light overlay
- **Fallback**: Static images for unsupported browsers
- **Optimized**: Multiple video sources for compatibility

## 🔒 Security Features

- CORS protection for API endpoints
- Request validation and sanitization
- Rate limiting capabilities
- Secure secret management
- HTTPS-only deployment
- Input validation for all forms

## 🌐 Production Deployment

### Automatic Deployment
```bash
# Deploy to Cloudflare Workers global network
npm run deploy
```

### Manual Configuration
1. Configure KV namespaces in Cloudflare Dashboard
2. Set up SendGrid API key as secret
3. Update environment variables
4. Deploy using Wrangler CLI

## 📊 Monitoring and Analytics

- Health check endpoint for monitoring
- Error logging and tracking
- Request/response logging
- Performance metrics collection
- Uptime monitoring capabilities

## 🛠️ Development Workflow

1. **Local Development**: `npm run dev`
2. **Testing**: Manual API testing with health endpoint
3. **KV Setup**: One-time namespace creation
4. **Secrets Configuration**: Secure API key management
5. **Deployment**: Global CDN deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For inquiries, please contact [Avalance Tech Solutions](mailto:avalancetechpartner@gmail.com)

## 🔗 Live Application

**Production URL**: https://avalance-tech-solutions-worker.valerian-agbata.workers.dev

---

### Architecture Notes

This application demonstrates modern serverless web development with:
- **Edge Computing**: Global Cloudflare Workers network
- **Static Site Generation**: Optimized asset delivery
- **API Integration**: RESTful endpoints with proper HTTP methods
- **Database-less**: KV storage for simplicity and scalability
- **Modern Frontend**: Responsive design with video backgrounds
- **Email Integration**: Transactional email notifications
- **DevOps Ready**: CI/CD-friendly deployment process
