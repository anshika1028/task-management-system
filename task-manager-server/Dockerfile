# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/server.js"]
