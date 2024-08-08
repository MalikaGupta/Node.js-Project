# Node.js and MongoDB Project

## Project Overview

The ITE5315 Project aims to develop a secure, database-driven Node.js/Express application (REST API) that interacts with a MongoDB database to manage restaurant data. This project is designed to reinforce the concepts learned during the course and provide hands-on experience in building a full-fledged web application with a backend API.

## Project Specification

### Step 0: Initial Setup

- Create a project directory named `5315-project`.
- Use Git to manage source code by creating a repository on GitHub.
- Initialize a Git repository locally and push the initial commit to GitHub.

### Step 1: Loading Data into MongoDB Atlas

- Create a new database called `5315-project`.
- Create a collection named `restaurants`.
- Import the provided `restaurants.json` file into the `restaurants` collection using MongoDB Compass.

### Step 2: Building a Web API

- Install `express` and `mongoose` along with other required modules.
- Add a `start` script to `package.json` to run the application.
- Implement a module to interact with the MongoDB collection, providing the following functions:
  - `db.initialize(connectionString)`
  - `db.addNewRestaurant(data)`
  - `db.getAllRestaurants(page, perPage, borough)`
  - `db.getRestaurantById(id)`
  - `db.updateRestaurantById(data, id)`
  - `db.deleteRestaurantById(id)`
- Define the following API routes:
  - `POST /api/restaurants`: Add a new restaurant.
  - `GET /api/restaurants`: Get all restaurants with pagination and optional borough filtering.
  - `GET /api/restaurants/:id`: Get a specific restaurant by ID.
  - `PUT /api/restaurants/:id`: Update a specific restaurant by ID.
  - `DELETE /api/restaurants/:id`: Delete a specific restaurant by ID.

### Step 3: Adding UI

- Add a route that uses a form to accept parameters (`page`, `perPage`, `borough`) and displays the results using the Handlebars template engine.
- Design the form and apply CSS styles for a user-friendly interface.

### Step 4: Adding Security Features

- Use environment variables for sensitive information like the MongoDB connection string.
- Implement password encryption, JWT, and session/cookie mechanisms to secure routes and ensure only authorized users can access specific API endpoints:
  - `POST /api/restaurants`
  - `PUT /api/restaurants/:id`
  - `DELETE /api/restaurants/:id`

### Step 5: Adding New Functionality

- Enhance the application by adding a new feature, such as a new UI component, route, DB operation, or an npm package.
- An example feature could be a GraphQL implementation of the API.

### Step 6: Publishing to Vercel

- Deploy the application to Vercel using the Vercel CLI or GitHub integration for continuous deployment.
- Ensure the deployed application runs without errors.

## Project Expectations

- Follow best practices for handling asynchronous tasks and error handling.
- Use modern JavaScript standards, avoiding the `var` keyword.
- Structure the Node.js application properly, separating functionality and features logically.
- Apply the techniques and methodologies learned throughout the course.
