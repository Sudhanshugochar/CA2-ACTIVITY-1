# Use lightweight official Node.js runtime
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies first (from backend directory)
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source files
COPY backend/ ./

# Expose API port
EXPOSE 5000

# Health check to ensure container is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application server
CMD ["node", "server.js"]
