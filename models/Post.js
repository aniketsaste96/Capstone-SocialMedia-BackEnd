//models we use to create Schemas as we are using NoSQL data base we must format it 

const mongoose = require('mongoose');
//during any error check for spelling in this area like default etc
const PostSchema = new mongoose.Schema(
    {

        "userId": {
            type: String,
            required: true
        },
        desc: {
            type: String,
            max: 500
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: []
        },






    },
    //whenever we create user timestamps automatically updates
    { timestamps: true }

)

module.exports = mongoose.model('Post', PostSchema);
//import this in users.js and auth.js