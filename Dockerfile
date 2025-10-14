# Stage 1: builder
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies (cached separately)
COPY package*.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

# Debugging (optional, remove later)
RUN echo "Contents of /usr/src/app" && ls -la /usr/src/app
RUN echo "Contents of /usr/src/app/frontend/dist" && ls -la /usr/src/app/frontend/dist

# Stage 2: nginx runtime
FROM nginx:alpine AS runner
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]