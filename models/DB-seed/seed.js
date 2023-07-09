require('dotenv').config('../../.env');
const mongoose = require('mongoose');
const UsersModel = require('../UsersModel');

// import posts data to be seeded into database
const usersRaw = require('../draft-seeding/posts');

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
        console.error('Failed to seed users into database')
    })