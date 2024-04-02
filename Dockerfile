# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the monorepo files
COPY . .

# Build the NestJS projects
RUN yarn nx run-many --target=build --projects=apps/user-service,apps/wallet-service --parallel

# Expose the ports (replace with your app ports)
EXPOSE 8000 8001

# Start the applications
CMD yarn nx run-many --target=serve --projects=apps/user-service,apps/wallet-service --parallel