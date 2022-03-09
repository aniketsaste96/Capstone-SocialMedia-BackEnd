//models we use to create Schemas as we are using NoSQL data base we must format it 

const mongoose = require('mongoose');
//during any error check for spelling in this area like default etc
const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: {
            type: String,
        },
        text: {
            type: String,
        }
    },

    { timestamps: true }

)

module.exports = mongoose.model('Message', MessageSchema);
