# ESSDEVInteractiveTouchScreen

An interactive touch screen application built with Flask backend and React frontend, containerized with Docker for deployment on Raspberry Pi.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Running with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/JacobOmdara/ESSDEVInteractiveTouchScreen.git
cd ESSDEVInteractiveTouchScreen
```

2. Start the application:
```bash
docker-compose up
```

This will:
- Build and start the Flask backend on `http://localhost:5000`
- Build and start the React frontend on `http://localhost:3000`

3. Access the application:
- Frontend: Open your browser to `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Stopping the Application

```bash
docker-compose down
```

## Project Structure

```
.
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/
│   ├── src/                # React source code
│   ├── public/             # Public assets
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend Docker configuration
└── docker-compose.yml      # Docker Compose configuration
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/data` - Sample data endpoint

## Development

### Backend (Flask)

To run the backend locally without Docker:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend (React)

To run the frontend locally without Docker:
```bash
cd frontend
npm install
npm start
```