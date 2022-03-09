//models we use to create Schemas as we are using NoSQL data base we must format it 

const mongoose = require('mongoose');
//during any error check for spelling in this area like default etc
const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        }
    },

    { timestamps: true }

)

module.exports = mongoose.model('Conversation', ConversationSchema);
