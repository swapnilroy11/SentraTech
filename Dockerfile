# SentraTech Multi-Stage Build Dockerfile
# Optimized for Kaniko with memory constraints
FROM node:18-alpine as builder

# Set NODE_OPTIONS for memory optimization
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Set working directory
WORKDIR /workspace/app

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY packages/website/package.json ./packages/website/
COPY packages/dashboard/package.json ./packages/dashboard/

# Install dependencies with optimizations for Kaniko
RUN yarn install --frozen-lockfile --network-timeout 600000 --prefer-offline --production=false

# Copy only necessary source files (excluding node_modules via .dockerignore)
COPY packages/ ./packages/
COPY backend/ ./backend/
COPY emergent.config.js ./

# Build the website (primary target) - using monorepo build strategy
WORKDIR /workspace/app
RUN yarn build:website

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /workspace/app/packages/website/dist /usr/share/nginx/html

# Copy nginx configuration if exists
COPY --from=builder /workspace/app/packages/website/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]