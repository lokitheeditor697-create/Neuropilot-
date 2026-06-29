# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifest files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run production build
RUN npm run build

# ==========================================
# STAGE 2: Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files to install production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy build outputs from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy firebase config file if it exists (using a wildcard pattern to avoid build errors if missing)
COPY --from=builder /usr/src/app/firebase-applet-config*.json ./

# Use a non-root system user for improved security
USER node

# Expose port
EXPOSE 3000

# Start the Node.js production server
CMD ["node", "dist/server.cjs"]
