# Profile Service

A RESTful API service for managing personality profiles, comments, and voting on personality types.

## Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** (optional, for containerized deployment)

## Installation

Simply install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Local Development

Run the application directly with Node.js:

```bash
npm start
```

The server will start on `http://localhost:3000`

### Option 2: Docker

Run the application in a Docker container:

```bash
docker compose up --build -d
```

To stop the container:

```bash
docker compose down
```

## API Documentation

Once the application is running, the API documentation is available at:

**http://localhost:3000/api-docs**

This documentation endpoint lists all available API endpoints, including their request/response schemas and example payloads.

## Testing

To run the automated test:

```bash
npm test
```