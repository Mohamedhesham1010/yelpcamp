const mongoose = require('mongoose');
const express = require("express");
const cities = require('./cities');
const { places, descriptors } = require('./seedhelpers');
const Campground = require('../models/campground');

const dburi = "mongodb+srv://netninja:test1234@cluster0.j9bqysp.mongodb.net/";

mongoose.connect(dburi).then( (result => console.log("connected")));



const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author : '653933a4b2ea4faba43e5ea8',
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
           
            description:'Clean and comfortable',
            location: "asdad",
            images:[
                {
                  url: 'https://res.cloudinary.com/dt5wezm5j/image/upload/v1700023093/YelpCamp/j4ww04nx7uxyrh0hckaz.jpg',
                  filename: 'YelpCamp/j4ww04nx7uxyrh0hckaz',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dt5wezm5j/image/upload/v1700023104/YelpCamp/obyv2fuqho9dgir4eqsf.jpg',
                  filename: 'YelpCamp/obyv2fuqho9dgir4eqsf',
                 
                },
                {
                  url: 'https://res.cloudinary.com/dt5wezm5j/image/upload/v1700023112/YelpCamp/enfbyvao7zro0f9yamtv.jpg',
                  filename: 'YelpCamp/enfbyvao7zro0f9yamtv',
                  
                }
              ]
            
        })
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})