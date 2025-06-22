# 🚀 Avalance Tech Solutions

A modern IT consultation and cloud services platform built with Node.js, Express, and MongoDB. The application features a responsive frontend with interactive modals for service inquiries and a robust backend API.

## ✨ Features

- 🎨 Responsive web design with Bootstrap 5
- 💬 Interactive service inquiry modals
- ✉️ Contact form with email notifications via SendGrid
- 🔒 Secure authentication with JWT
- ⚡ Rate limiting for API endpoints
- 🐳 Containerized with Docker & Docker Compose
- 🩺 Health check endpoints
- ⚙️ Environment-based configuration
- 🔄 Process management with PM2

## 🏗️ Project Structure

```
.
├── public/               # Static files served by Express
│   ├── assets/          # Static assets (CSS, JS, images, fonts)
│   ├── index.html       # Main HTML file
│   └── ...
├── routes/              # API route handlers
├── models/              # MongoDB models
├── utils/               # Utility functions
├── server.js            # Express server
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Multi-container setup
├── .env.example         # Environment variables template
└── package.json         # Project metadata and dependencies
```

## 🚀 Prerequisites

- Node.js 20.13.1+ (LTS recommended)
- MongoDB Atlas account (https://cloud.mongodb.com)
- Docker 20.10+
- Docker Compose 2.0+
- SendGrid API key (for email notifications)

## 🛠️ Local Development Setup

### Without Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/avalance-tech-solutions.git
   cd avalance-tech-solutions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### With Docker

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/your-username/avalance-tech-solutions.git
   cd avalance-tech-solutions
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and start the containers**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Web application: http://localhost:3000
   - MongoDB Express: http://localhost:8081 (if enabled in docker-compose.yml)

## 🌍 Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then update the following variables in the `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://avalanche:avalanche@avalanche.4kq8t.mongodb.net/avalanche?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=30d

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=info@avalance-resources.online
TO_EMAIL=your-email@example.com

# Rate Limiting
RATE_LIMIT_WINDOW=1hr
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new project and cluster
3. Set up database access:
   - Go to Database Access
   - Add a new database user
   - Set username and password
   - Assign appropriate permissions (e.g., readWrite)
4. Set up network access:
   - Go to Network Access
   - Add your current IP address or allow access from anywhere (0.0.0.0/0) for development
5. Get your connection string:
   - Go to Database > Connect > Connect your application
   - Copy the connection string and update the `MONGODB_URI` in your `.env` file

## 🐳 Docker Commands

### Build the Docker image
```bash
docker build -t avalance-app .
```

### Run a container
```bash
docker run -d \
  --name avalance-app \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  avalance-app
```

### View logs
```bash
docker logs -f avalance-app
```

### Stop and remove containers
```bash
docker-compose down
```

## 🚀 Deployment

### Prerequisites
- Docker and Docker Compose installed on your server
- Domain name with DNS configured
- SSL certificates (recommended)

### Production Deployment

1. **Clone the repository on your server**
   ```bash
   git clone https://github.com/your-username/avalance-tech-solutions.git
   cd avalance-tech-solutions
   ```

2. **Set up production environment variables**
   ```bash
   cp .env.example .env.production
   nano .env.production  # Update with production values
   ```

3. **Start the application**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. **Set up Nginx as reverse proxy (recommended)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;

       ssl_certificate /path/to/your/cert.pem;
       ssl_certificate_key /path/to/your/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🛡️ Security

- Always use HTTPS in production
- Keep dependencies updated
- Use strong, unique passwords
- Regularly back up your database
- Implement proper CORS policies
- Use environment variables for sensitive data

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [SendGrid](https://sendgrid.com/)
- [Docker](https://www.docker.com/)
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