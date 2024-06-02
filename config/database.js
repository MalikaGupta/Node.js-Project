// database.js file - controller
const url = process.env.DB_CONNECTION_STRING;
const mongoose = require('mongoose');
const Restaurant = require("../models/restaurants");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const SECRET_KEY=process.env.SECRET_KEY;

//JWT
const jwt = require('jsonwebtoken');
//Connect with the database using the db connection string from the .env file
const initialize = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
};
//set the maxAge jwt tokens and use this in the app.js file to set the age for cookie too
const maxAge = 24*60*60;//1 day in seconds
const createToken = (id) => {
    return jwt.sign({ id },SECRET_KEY,{
        expiresIn:maxAge
    })
};

const createUser = async ({username,password}) => {
    try {
        const hashedPass = await bcrypt.hash(password,saltRounds);
        const newUser = await User.create({ username, password:hashedPass });
        return newUser;
    } catch (error) {
        console.error('Error creating new user:', error.message);
        throw error;
    }
};

//check that the token in the cookie is valid
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    //verify the token - is it actually valid?
    if (token) {
        jwt.verify(token,SECRET_KEY, (error,decodedToken) =>{
            if(error){
                console.log(error.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

//Check the current user logged in
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            res.locals.user = null;
            next();
            } else {
            const currentUser = await User.findById(decodedToken.id).lean();
            res.locals.user = currentUser;
            next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
    };

//login the user by checking the username and password
const loginUser = async (username,password) => {
    try {
        const findUser = await User.findOne({username});//is there a user with this username in db?
        if(findUser){
            const auth = await bcrypt.compare(password, findUser.password);//is this the correct password for that username?
            if(auth){
                return findUser;
            }
            throw Error('Incorrect password for this username. Try again.');
        }
        throw Error('No user exists with this username!!');
    } catch (error) {
        console.error('Error creating new user:', error.message);
        throw error;
    }
};

//add a new restaurant based on the data entered
const addNewRestaurant = async(data)=>{
    try{
        const restaurant = new Restaurant(data);
        await restaurant.save();
        return restaurant;
    } catch (error) {
        console.error('Error adding new restaurant:', error.message);
        throw error;
    }
};

//retrieve all restaurant information based on page, perPage and borough from db
const getAllRestaurants = async (page, perPage, borough)=>{
    try{
        const optionalBorough = borough ? {borough}:{};
        const restro = await Restaurant.find(optionalBorough).sort({restaurant_id:1}).skip((page-1)*perPage).limit(perPage).lean();
        return restro;
    } catch (error){
        console.error('Error getting restaurant information based on these paramenetrs. Please see: ',error.message);
        throw error;
    }
};

//Get all the restaurants' details based on suicine and borough filters
const getFavRestaurants = async (cuisine, borough)=>{
    try{
        const query = {};
        if (cuisine) {
            query.cuisine = cuisine;
        }
        if (borough) {
            query.borough = borough;
        }
        const restro = await Restaurant.find(query).lean();
        return restro;
    } catch (error){
        console.error('Error getting restaurant information based on these paramenetrs. Please see: ',error.message);
        throw error;
    }
};

//get restaurant information based on the restaurant id entered from the db
const getRestaurantById = async (Id)=>{
    try{
        const restro = await Restaurant.findById(Id);
        return restro;
    } catch (error){
        console.error('Error getting restaurant information based on this Id. Please see: ',error.message);
        throw error;
    }
};

const updateRestaurantById  = async (Id,data)=>{
    try{
        const restro = await Restaurant.findByIdAndUpdate(Id,data,{new:true});
        return restro;
    } catch (error){
        console.error('Error updating the restaurant information: ',error.message);
        throw error;
    }
};

const deleteRestaurantById  = async (Id)=>{
    try{
        const restroDeleted = await Restaurant.findOneAndDelete({
            _id:Id,
        });
        return restroDeleted;
    } catch (error){
        console.error('Error deleting the restaurant information: ',error.message);
        throw error;
    }
};

module.exports = {  initialize,
                    addNewRestaurant, 
                    getAllRestaurants, 
                    getRestaurantById,
                    updateRestaurantById,
                    deleteRestaurantById,
                    createUser,
                    createToken, maxAge,
                    loginUser,
                    requireAuth,
                    checkUser,getFavRestaurants,
                 };
