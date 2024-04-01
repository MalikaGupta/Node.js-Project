require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const appConfig = require("./package.json");

const app = express();
const database = require("./config/database");
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

const Restaurant = require("./models/restaurants");

//get all restaurant data from db
app.get("/api/restaurant", async (req, res) => {
  // use mongoose to get all employees in the database
    try {
        const restro = await Restaurant.find();
        res.json(restro);
    } catch (reason) {
        res.status(500).json(reason);
    }
});

app.listen(port, () => {
    console.log(`${appConfig.name} listening on port: ${port}`);
});
