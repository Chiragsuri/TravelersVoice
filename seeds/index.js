const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');


//Setting UP MONGOOSE
mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("DATABASE CONNECTED")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//image function
async function seedImg(random10) {
    try {
        const res = await axios.get('https://api.pexels.com/v1/search', {
            headers: {
                Accept: "application/json",
                Authorization: "nHuUrBhegUtp8jmJdMjVPnay7s24CYJn67GQADDOKjVzrcjSuKzezbBr"
            },
            params: {
                query: 'camping'
            }

        })
        // console.log(res.data.photos[random10].src.original);
        return res.data.photos[random10].src.original;
    }
    catch (err) {
        console.log(err);
    }
}

//



const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // setup
        const placeSeed = Math.floor(Math.random() * places.length)
        const descriptorsSeed = Math.floor(Math.random() * descriptors.length)
        const citySeed = Math.floor(Math.random() * cities.length)

        // seed data into campground
        const camp = new Campground({
            imageUrl: await seedImg(),
            title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
            location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            author: '6432a0860993d3b4c496cb0a'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})