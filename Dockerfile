# Use node:21-alpine as the base image
FROM node:21-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your application code
COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

RUN ls -la

# Define the command to run the app in development mode
CMD ["npm", "run", "preview"]