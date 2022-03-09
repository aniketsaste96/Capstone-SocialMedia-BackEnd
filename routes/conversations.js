const router = require('express').Router();
//import model
const Conversation = require('../models/Conversation')

router.post("/", async (req, res) => {
    //creating new model
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })
    //save to mondoDB
    try {
        const saveNewConvsersation = await newConversation.save();
        res.status(200).json(saveNewConvsersation);

    } catch (error) {
        res.status(500).json(error)
    }
})
//get conversations using userId
router.get("/:userId", async (req, res) => {
    try {
        
        const getconversaton = await Conversation.find({
            members: { $in: [req.params.userId] },
        })
        res.status(200).json(getconversaton);
    } catch (error) {
        console.log(error);

    }

})

module.exports = router;
