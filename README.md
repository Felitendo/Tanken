# Tanken

A Progressive Web App for tracking real-time diesel and fuel prices near you. Configurable for any location in Germany supported by the [Tankerkoenig API](https://creativecommons.tankerkoenig.de/).

## Features

- **Live fuel prices** from nearby gas stations via the Tankerkoenig API
- **Price alerts** with configurable thresholds (good / okay / expensive)
- **Price history and statistics** to spot trends over time
- **Email notifications** when prices drop below your target (SMTP)
- **PWA support** - install it on your phone's home screen for a native-like experience
- **OIDC authentication** - optionally secure access with any OpenID Connect provider
- **Admin panel** at `/admin` for setup, configuration, and user management

## Installation with Docker Compose (GHCR)

### Prerequisites

- Docker and Docker Compose installed
- A [Tankerkoenig API key](https://creativecommons.tankerkoenig.de/) (free)

### 1. Create a `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: tanken-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: tanken
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d tanken"]
      interval: 10s
      timeout: 5s
      retries: 5

  tanken:
    image: ghcr.io/felitendo/tanken:latest
    container_name: tanken-webapp
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "3847:3847"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3847
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/tanken

volumes:
  postgres_data:
```

### 2. Start the stack

```bash
docker compose up -d
```

### 3. Open the admin panel

Navigate to `http://localhost:3847/admin` to complete the initial setup:

1. Create your admin account
2. Enter your Tankerkoenig API key
3. Configure locations, fuel type, and alert thresholds
4. Optionally set up SMTP for email notifications and OIDC for authentication

That's it - the app is now running at `http://localhost:3847`.

### Updating

```bash
docker compose pull
docker compose up -d
```

## Configuration

All configuration is managed through the admin panel at `/admin`. No `.env` file or manual config is required - everything is set up through the UI.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Main application |
| `GET` | `/admin` | Admin panel |
| `GET` | `/health` | Health check |
| `GET` | `/ready` | Readiness check |
| `GET` | `/api/config` | Public app config |
| `GET` | `/api/stations` | Current fuel prices |
| `GET` | `/api/station/:id` | Single station details |
| `GET` | `/api/history` | Price history |
| `GET` | `/api/stats` | Price statistics |
| `GET` | `/auth/oidc/start` | Start OIDC login |
| `GET` | `/auth/oidc/callback` | OIDC callback |

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3847`. You'll need a running PostgreSQL instance - use the database service from Docker Compose or your own:

```bash
docker compose up -d postgres
```

Then set `DATABASE_URL` before starting the dev server:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tanken npm run dev
```

## License

MIT
