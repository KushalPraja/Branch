# Branch Backend

A FastAPI backend for the Branch application.

## Running with Docker

The easiest way to run the backend is using Docker and docker-compose:

### Prerequisites

- Docker and Docker Compose installed on your system

### Steps to run

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd branch_backend
   ```
3. Create a `.env` file with your environment variables:
   ```
   SECRET_KEY=your_secret_key_here
   API_PREFIX=/api/v1
   ```
4. Build and start the containers:
   ```
   docker-compose up -d
   ```
5. The API will be available at http://localhost:8000

### Accessing the API

- API documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Stopping the containers

```
docker-compose down
```

To remove volumes as well (deletes the database):

```
docker-compose down -v
```

## Development

To make changes to the code during development:

1. Make changes to the code
2. The server should hot-reload if you're using volumes as specified in the docker-compose.yml

For more extensive changes, you might need to rebuild:

```
docker-compose build
docker-compose up -d
```
