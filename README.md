# Avalance Tech Solutions

A modern IT consultation and cloud services platform built with Node.js, Express, and MongoDB. The application features a responsive frontend with interactive modals for service inquiries and a robust backend API.

## ✨ Features

- Responsive web design with Bootstrap 5
- Interactive service inquiry modals
- Contact form with email notifications via SendGrid
- Secure authentication with JWT
- Rate limiting for API endpoints
- Containerized with Docker
- Health check endpoints
- Environment-based configuration

## 🏗️ Project Structure

```
.
├── public/           # Static files served by Express
│   ├── assets/      # Static assets (CSS, JS, images, fonts)
│   ├── index.html   # Main HTML file
│   └── ...
├── routes/          # API route handlers
├── models/          # MongoDB models
├── utils/           # Utility functions
├── server.js        # Express server
├── Dockerfile       # Container configuration
├── .env.example     # Environment variables template
└── package.json     # Project metadata and dependencies
```

## 🚀 Prerequisites

- Node.js 20+ (LTS recommended)
- MongoDB 6.0+ (Atlas or local)
- Docker 20.10+
- SendGrid API key (for email notifications)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/avalance-tech-solutions.git
   cd avalance-tech-solutions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/avalance
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   
   # SendGrid
   SENDGRID_API_KEY=your_sendgrid_key
   FROM_EMAIL=info@avalance-resources.online
   TO_EMAIL=avalancetechpartner@gmail.com
   
   # Rate Limiting
   RATE_LIMIT_WINDOW=15m
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## 🐳 Docker Setup

Build and run using Docker:

```bash
# Build the Docker image
docker build -t avalance-tech .

# Run the container
docker run -d \
  -p 3000:3000 \
  --name avalance-app \
  --env-file .env \
  avalance-tech
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

Run tests:
```bash
npm test
```

## 🌐 Production Deployment

For production deployment, consider:
- Using a process manager like PM2
- Setting up Nginx as a reverse proxy
- Configuring SSL/TLS certificates
- Setting up monitoring and logging
- Using environment variables for sensitive data
- Implementing proper backup strategies

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Application environment | No | `development` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `30d` |
| `SENDGRID_API_KEY` | SendGrid API key | Yes | - |
| `FROM_EMAIL` | Sender email address | Yes | - |
| `TO_EMAIL` | Recipient email address | Yes | - |
| `RATE_LIMIT_WINDOW` | Rate limiting window | No | `15m` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | `100` |

## 🔄 API Endpoints

- `GET /` - Main application
- `GET /health` - Health check endpoint
- `POST /api/contact` - Submit contact form
- `GET /api/projects` - List all projects
- `GET /api/team` - Get team members

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For inquiries, please contact [Avalance Tech Solutions](mailto:avalancetechpartner@gmail.com)

## Security Features

- Secure MongoDB authentication with username/password
- JWT for API authentication
- Rate limiting to prevent abuse
- CORS protection
- Secure HTTP headers
- Request validation
- Error handling middleware

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB connection string format:
  ```
  mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
  ```
- Ensure your MongoDB user has the correct permissions
- Check if your IP is whitelisted in MongoDB Atlas (if using Atlas)
- Ensure MongoDB is running and accessible

### Static Assets Not Loading
- Verify file paths in HTML/CSS
- Check file permissions in the container
- Ensure build process completed successfully

## License

This project is licensed under the MIT License.