FROM --platform=linux/amd64 golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build the application for linux/amd64
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o blog-api .

# Final stage
FROM --platform=linux/amd64 alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/blog-api .

# Expose port (default 8080, can be overridden via SERVER_PORT env var)
EXPOSE 8080

# Run the application
CMD ["./blog-api"]


