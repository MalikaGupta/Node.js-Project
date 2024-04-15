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

const initialize = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
};

const maxAge = 24*60*60;
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

const loginUser = async (username,password) => {
    try {
        const findUser = await User.findOne({username});
        if(findUser){
            const auth = await bcrypt.compare(password, findUser.password);
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
                    checkUser,
                 };
