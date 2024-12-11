# Project Universal Workflow Documentation

## Project Overview
This project consists of a backend service, React Native mobile application, and MongoDB database, all containerized using Docker.

## Technology Stack
- Backend: HTTP Server
- Frontend: React Native Mobile App
- Database: MongoDB
- Containerization: Docker

## Server Details
- Server Address: http://193.40.11.236:80

## Prerequisites
- Docker
- Docker Compose
- Node.js
- React Native development environment

## Project Setup

### 1. Clone Repository
```bash
git clone repo
cd universal workflow
```

### 2. Environment Configuration
Create a `.env` file with:
```
BACKEND_PORT=80
BACKEND_HOST=193.40.11.236
MONGO_URI=mongodb://mongodb:27017/yourdbname
MONGO_PORT=27017
REACT_NATIVE_API_URL=http://193.40.11.236:80/api
```

### 3. Docker Commands

#### Build and Run
```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Check container status
docker-compose ps
```

#### Stop Containers
```bash
docker-compose down
```

## Start Front end app

#start expo 
```bash
npm start
choose a 
```
## Development Workflows


### Backend
```bash
# Run tests
docker-compose run backend npm test

# Lint code
docker-compose run backend npm run lint
```

### Frontend
```bash
# Install dependencies
npm install

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## Logging and Debugging

### View Logs
```bash
# Backend logs
docker-compose logs backend

# MongoDB logs
docker-compose logs mongodb

# All service logs
docker-compose logs
```

## Database Management

### MongoDB Commands
```bash
# Connect to MongoDB
docker-compose exec mongodb mongo

# Backup database
docker-compose exec mongodb mongodump

# Restore database
docker-compose exec mongodb mongorestore
```

## Troubleshooting
```bash
# Check Docker
docker info

# Container status
docker-compose ps
docker-compose ps -a

# Restart service
docker-compose restart backend
```

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## Notes
- Ensure firewall allows port 80
- Use SSL/TLS in production
- Implement authentication
- Set up monitoring

## Project Structure
```
/universal-workflow-team-21
│
├── Backend-server/           # Backend service
├── Frontend/            # React Native app
├── docker-compose.yml # Docker configuration
```