
FROM node:21

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
CMD ng serve --host 0.0.0.0 --disable-host-check --configuration=production

# docker run -p 4200:4200 -d --network=ofml_net --name frontend ofml_web