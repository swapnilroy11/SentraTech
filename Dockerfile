# SentraTech Multi-Stage Build Dockerfile
# Fixed for Kaniko - using /app working directory
FROM node:18-alpine as builder

# Set NODE_OPTIONS for memory optimization
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Set working directory to /app (where Kaniko expects package.json)
WORKDIR /app

# Copy root package.json + lockfile so Kaniko sees them at /app
COPY package.json yarn.lock ./

# Copy the rest of the monorepo (so workspaces are available)
COPY . .

# Install all dependencies (workspaces)
RUN yarn install --frozen-lockfile --network-timeout 600000 --prefer-offline

# Build frontend and backend with debug info
RUN echo "=== PRE-BUILD DEBUG INFO ===" && \
    echo "Current directory: $(pwd)" && \
    echo "Package.json exists: $(ls -la package.json)" && \
    df -h && \
    free -h && \
    echo "Node version: $(node --version)" && \
    echo "Yarn version: $(yarn --version)" && \
    echo "=== STARTING WORKSPACE BUILD ===" && \
    yarn workspace frontend build && \
    echo "=== BUILD COMPLETED ===" && \
    ls -la packages/website/dist/ && \
    echo "=== POST-BUILD DEBUG INFO ===" && \
    df -h

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/packages/website/dist /usr/share/nginx/html

# Copy nginx configuration if exists
COPY --from=builder /app/packages/website/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]