# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app in production mode
RUN npm run

# Expose the port the app runs on
EXPOSE 4200

# Define the command to run your app using ng serve
CMD ["npm", "start"]
