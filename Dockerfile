# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.30.2

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build TypeScript
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.30.2

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
