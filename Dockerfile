# Use Node.js LTS
FROM node:20-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Ensure the application listens on all interfaces
ENV HOST=0.0.0.0
EXPOSE 5000
CMD [ "npm", "start" ]
