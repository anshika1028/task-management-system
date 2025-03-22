# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

COPY . /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli
RUN npm install

# Build the TypeScript project
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 8080

# Run the compiled app
CMD ["ng", "serve", "--host", "0.0.0.0"]


# Dcoker command to build
# docker build -t task-manager-server .