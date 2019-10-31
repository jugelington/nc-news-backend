# Use node as a base image
FROM node:12

# Create & enter app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy across everything else
COPY . .

# Start the app when the container starts
CMD ["npm", "start"]