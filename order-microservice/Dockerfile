# Use a base image that supports pnpm, like Node.js
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

COPY package.json  pnpm-lock.yaml ./


# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . .