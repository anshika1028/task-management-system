# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the rest of the app
COPY . /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the TypeScript project
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/server.js"]


# Docker command to build
# docker build -t task-manager-server .
