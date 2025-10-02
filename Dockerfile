# SentraTech Multi-Stage Build Dockerfile
# Compatible with both Kaniko and BuildX
FROM node:18-alpine as builder

# Set working directory
WORKDIR /workspace/app

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY packages/website/package.json ./packages/website/
COPY packages/dashboard/package.json ./packages/dashboard/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

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