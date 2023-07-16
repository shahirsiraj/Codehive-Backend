/*
require('dotenv').config('../../.env');
const mongoose = require('mongoose');
const UsersModel = require('../UsersModel');
const bcrypt = require("bcrypt");

// import posts data to be seeded into database
const usersRaw = require('../draft-seeding/users');

// make a connection to DB
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(async() => {
        console.log('seeding users into DB...')


        
        // insert into DB using Model
        const seedUsersResults = await UsersModel.insertMany(usersRaw)

        console.log(seedUsersResults)

        mongoose.disconnect()
    }
    )
    .catch(err => {
        console.error(`Failed to seed users into database ${err}`)
    })
*/

require('dotenv').config('../../.env');
const mongoose = require('mongoose');
const UsersModel = require('../UsersModel');
const bcrypt = require("bcrypt");

// Import users data to be seeded into the database
const usersRaw = require('../draft-seeding/users');

// Function to hash passwords from seeded data
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

// Function to seed users into the database
async function seedUsers() {
    try {
        // Make a connection to the database
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`);

        console.log('Seeding users into DB...');

        // Hash passwords for each user
        for (let i = 0; i < usersRaw.length; i++) {
            const user = usersRaw[i];
            const hashedPassword = await hashPassword(user.password);
            user.password = hashedPassword;
        }

        // Insert users into the database using the Model
        const seedUsersResults = await UsersModel.insertMany(usersRaw);
        console.log(seedUsersResults);

        // Disconnect from the database
        mongoose.disconnect();
    } catch (error) {
        console.error(`Failed to seed users into the database: ${error}`);
    }
}

// Call the seeding function
seedUsers();
