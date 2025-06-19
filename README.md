# Avalance Tech Solutions

Backend API and frontend for Avalance Tech Solutions IT consultation website.

## Project Structure

```
.
├── public/           # Publicly accessible files
│   ├── assets/      # Static assets
│   │   ├── css/     # Stylesheets
│   │   ├── js/      # JavaScript files
│   │   ├── images/  # Images
│   │   └── fonts/   # Font files
│   ├── index.html   # Main HTML file
│   └── sw.js        # Service Worker
├── scripts/         # Build and utility scripts
├── routes/          # API routes
├── models/          # Database models
├── config/          # Configuration files
├── server.js        # Main server file
├── Dockerfile       # Docker configuration
└── .env             # Environment variables
```

## Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Docker (for containerized deployment)
- X.509 certificate for MongoDB authentication

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd avalance-tech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - `MONGODB_URI`: MongoDB connection string
   - `MONGODB_CERT_PATH`: Path to X.509 certificate
   - `JWT_SECRET`: Secret for JWT token generation
   - `NODE_ENV`: Environment (development/production)
   - `PORT`: Server port (default: 3000)

5. Build the frontend assets:
```bash
npm run build
```

## Development

Start the development server with hot-reload:
```bash
npm run dev
```

## Build Process

The build process includes:
- Minification of CSS and JavaScript files
- Asset optimization
- Service worker generation
- Static file serving with proper caching headers

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t avalance-tech:latest .
```

2. Run the container:
```bash
docker run -p 3000:3000 -e NODE_ENV=development avalance-tech:latest
```


## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Application environment | No | `development` |
| `PORT` | Server port | No | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `MONGODB_CERT_PATH` | Path to X.509 certificate | Yes | - |
| `JWT_SECRET` | Secret for JWT tokens | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | No | `100` |

## API Endpoints

- `GET /health` - Health check
- `POST /api/contact` - Submit contact form
- `GET /api/projects` - List all projects
- `GET /api/team` - Get team members

## Security Features

- X.509 Certificate Authentication for MongoDB
- JWT for API authentication
- Rate limiting
- CORS protection
- Secure HTTP headers
- Request validation
- Error handling middleware

## Troubleshooting

### MongoDB Connection Issues
- Verify X.509 certificate path and permissions
- Check MongoDB connection string format
- Ensure MongoDB is running and accessible

### Static Assets Not Loading
- Verify file paths in HTML/CSS
- Check file permissions in the container
- Ensure build process completed successfully

## License

This project is licensed under the MIT License.