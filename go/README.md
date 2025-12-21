# Blog API

A simple blog API built with Go, Gin, and PostgreSQL.

## Features

- CRUD operations for blog posts
- PostgreSQL database with Docker
- RESTful API endpoints
- API key authentication for all operations
- Rate limiting to prevent abuse
- UUID-based identifiers
- Auto-generated slug-based URL routing
- View count tracking
- Cloudinary image upload integration
- Category and tags support

## Prerequisites

- Go 1.21 or higher
- Docker and Docker Compose

## Setup Instructions

1. **Start PostgreSQL using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Install Go dependencies:**
   ```bash
   go mod download
   ```

3. **Create a `.env` file in the `go` directory:**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=blog_user
   DB_PASSWORD=blog_password
   DB_NAME=blog_db
   DB_SSLMODE=disable
   SERVER_PORT=8080
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   API_KEY=your-secure-api-key-here
   RATE_LIMIT_RPS=10
   RATE_LIMIT_BURST=20
   ```
   
   **Notes:**
   - Replace `API_KEY`, `API_SECRET`, and `CLOUD_NAME` with your actual Cloudinary credentials. You can find these in your Cloudinary dashboard.
   - Replace `API_KEY` with a secure random string (generate using `openssl rand -hex 32`). This key is required for all API operations.
   - `RATE_LIMIT_RPS`: Requests per second allowed per IP (default: 10)
   - `RATE_LIMIT_BURST`: Maximum burst of requests allowed (default: 20)
   - See [SECURITY.md](./SECURITY.md) for detailed security setup instructions.

4. **Run the application:**
   ```bash
   go run main.go
   ```

   The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /api/v1/health` - Check server status

### Blogs
All blog endpoints require API key authentication and are rate limited:
- `POST /api/v1/blogs` - Create a new blog (accepts multipart form data with optional image upload) **[🔒 Protected]**
- `GET /api/v1/blogs` - Get all blogs (with pagination: `?limit=10&offset=0`) **[🔒 Protected]**
- `GET /api/v1/blogs/:id` - Get blog by ID **[🔒 Protected]**
- `GET /api/v1/blogs/slug/:slug` - Get blog by slug (increments view count) **[🔒 Protected]**
- `PUT /api/v1/blogs/:id` - Update blog **[🔒 Protected]**
- `DELETE /api/v1/blogs/:id` - Delete blog **[🔒 Protected]**

**Note:** All endpoints require API key authentication. Provide the API key in the `X-API-Key` header or `Authorization: Bearer <key>` header.

**Rate Limiting:** All blog endpoints are rate limited per IP address. Default limits are 10 requests per second with a burst of 20 requests. When rate limit is exceeded, the API returns `429 Too Many Requests`. Configure limits using `RATE_LIMIT_RPS` and `RATE_LIMIT_BURST` environment variables.

## Example Requests

Use the returned `url` as the `featured_image` value when creating or updating a blog post.

### Create Blog (with image upload)
```bash
curl -X POST http://localhost:8080/api/v1/blogs \
  -H "X-API-Key: your-api-key-here" \
  -F "title=My First Blog Post" \
  -F "content=This is the full content of my blog post..." \
  -F "excerpt=A brief summary" \
  -F "category=Technology" \
  -F "tags=go,api,blogging" \
  -F "status=published" \
  -F "image=@/path/to/your/image.jpg"
```

**Note:** The slug is automatically generated from the title. The `X-API-Key` header is required for write operations.

**Note:** The image field is optional. If provided, it will be uploaded to Cloudinary and the CDN URL will be automatically saved to the `featured_image` field in the database.

### Get All Blogs
```bash
curl -H "X-API-Key: your-api-key-here" http://localhost:8080/api/v1/blogs?limit=10&offset=0
```

### Get Blog by ID
```bash
curl -H "X-API-Key: your-api-key-here" http://localhost:8080/api/v1/blogs/550e8400-e29b-41d4-a716-446655440000
```

### Update Blog
```bash
curl -X PUT http://localhost:8080/api/v1/blogs/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-API-Key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "published"
  }'
```

### Delete Blog
```bash
curl -X DELETE http://localhost:8080/api/v1/blogs/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-API-Key: your-api-key-here"
```

## Database Schema

The `blogs` table includes:
- `id` (UUID, Primary Key)
- `title` (VARCHAR(255))
- `slug` (VARCHAR(255), Unique)
- `content` (TEXT)
- `excerpt` (TEXT, Optional)
- `category` (VARCHAR(100), Optional)
- `tags` (JSONB, Array of strings)
- `status` (VARCHAR(20), Default: 'draft')
- `featured_image` (VARCHAR(255), Optional)
- `view_count` (INT, Default: 0)
- `published_at` (TIMESTAMP, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Project Structure

```
go/
├── main.go                    # Application entry point
├── go.mod                     # Go module dependencies
├── docker-compose.yml         # PostgreSQL Docker setup
├── internal/
│   ├── database/
│   │   └── db.go             # Database connection and setup
│   ├── models/
│   │   └── blog.go           # Blog data models
│   ├── repository/
│   │   └── blog_repository.go # Database operations
│   ├── services/
│   │   └── cloudinary_service.go # Cloudinary image upload service
│   ├── handlers/
│   │   ├── blog_handler.go   # HTTP request handlers
│   │   └── upload_handler.go # Image upload handler
│   ├── routes/
│   │   └── routes.go         # Route definitions
│   ├── middleware/
│   │   ├── auth.go           # API key authentication middleware
│   │   └── ratelimit.go      # Rate limiting middleware
│   └── utils/
│       └── slug.go           # Slug generation utilities
```

## Stopping the Database

To stop the PostgreSQL container:
```bash
docker-compose down
```

To stop and remove volumes:
```bash
docker-compose down -v
```

## Security

All API endpoints require API key authentication. You must provide a valid API key in the `X-API-Key` header or `Authorization: Bearer <key>` header for all requests.

**Setup:**
1. Generate an API key: `openssl rand -hex 32`
2. Add to `go/.env`: `API_KEY=your-generated-api-key-here`
3. Add to `.env.local` (frontend): `NEXT_PUBLIC_API_KEY=your-generated-api-key-here`

**Example:**
```bash
curl -H "X-API-Key: your-api-key-here" http://localhost:8080/api/v1/blogs
```

