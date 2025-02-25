# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json .
RUN bun install --frozen-lockfile

# Copy rest of the files
COPY . .

# Build the binary
RUN bun run build:bin

# Final stage
FROM debian:bookworm-slim

# Copy only the compiled binary
COPY --from=builder /app/server .

EXPOSE 3000

# Run the binary
CMD sh -c "./server --database-url $DATABASE_URL"
