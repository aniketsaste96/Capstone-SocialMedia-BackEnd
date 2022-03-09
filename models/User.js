//models we use to create Schemas as we are using NoSQL data base we must format it 

const mongoose = require('mongoose');
//during any error check for spelling in this area like default etc
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: ""
            //empty at first time
        },
        coverPicture: {
            type: String,
            default: ""
            //empty at first time
        },
        followers: {
            //Array bcz we are going to save user id with them when they follow u
            type: Array,
            default: []
        },
        followings: {
            //Array bcz we are going to save user id with them when they follow u
            type: Array,
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        desc: {
            type: String,
            max: 40
        },
        city: {
            type: String,
            max: 50
        },
        from: {
            type: String,
            max: 50
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3]
        },


    },
    //whenever we create user timestamps automatically updates
    { timestamps: true }

)

module.exports = mongoose.model('User', UserSchema);
//import this in users.js and auth.js