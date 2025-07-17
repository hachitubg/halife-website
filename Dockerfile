# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with optimization
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Set environment variable for production
ENV VITE_API_URL=http://14.225.212.44:8000
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve@14.2.1

# Remove unnecessary files to reduce image size
RUN rm -rf node_modules src public/data/.git

# Expose port
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]