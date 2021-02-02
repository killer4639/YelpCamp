const cities = require('./cities');
const mongoose = require('mongoose');
const {
    places,
    descriptors
} = require('./seedHelpers');
const Campground = require('../models/campground');
const {
    title
} = require('process');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const genPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '60118fff4e83e71d3c0572aa',
            images: [{
                    url: 'https://res.cloudinary.com/dz5e19aeg/image/upload/v1612119724/YelpCamp/z6rwi08hyhbekf8guca7.jpg',
                    filename: 'YelpCamp/z6rwi08hyhbekf8guca7'
                },
                {
                    url: 'https://res.cloudinary.com/dz5e19aeg/image/upload/v1612119724/YelpCamp/qx9pfgqdpwxqyywfh0ee.jpg',
                    filename: 'YelpCamp/qx9pfgqdpwxqyywfh0ee'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem praesentium perspiciatis adipisci modi sint nemo et, nobis eius doloremque expedita in officiis. Aliquam sapiente doloribus odit ad necessitatibus rem nemo!',
            price: genPrice
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});