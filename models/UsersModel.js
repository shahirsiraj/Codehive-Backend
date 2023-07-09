const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }, 
        password: { type: String, required: true }

        /*
        Possible extras:
        - link with GitHub API to call for Repo links 
        - independent biography/Progaramming Lang Fluency/Profession (for simpler updating)
        - add a validator variable before being able to update posted post (a logic to check if user is the person that posted the post)  
        
        */
    }
);

const User = mongoose.model('User', usersSchema);

module.exports = User;