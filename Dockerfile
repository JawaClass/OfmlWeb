# Stage 1: Build stage
FROM node:18.13.0-bullseye-slim as builder

RUN mkdir /app

# Install Angular CLI
RUN npm install -g @angular/cli@13 @angular-devkit/build-angular

# Copy only the package files to leverage Docker caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire project
COPY . .

# Stage 2: Development stage
FROM builder as development

# Set the working directory
WORKDIR /app

# Expose the default Angular development server port
EXPOSE 4200

# Use CMD to start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000", "--disable-host-check"]

# Build the image with: docker build -t angular-dev .
# Run the container with: docker run -p 4200:4200 -v C:\Users\masteroflich\AngularProjects\OfmlWeb:/app angular-dev
  