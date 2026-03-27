# Stage 1: build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy all source code
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: serve static files
FROM node:20-slim

WORKDIR /app

# Install a small static server
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 6620

# Serve static files
CMD ["serve", "-s", "dist", "-l", "6620"]
