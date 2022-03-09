const router = require('express').Router();
const Comments = require('../models/Comments')

//comment
router.post("/", async (req, res) => {

    const newComment = new Comments(req.body);

    try {
        const savenewComment = await newComment.save();
        res.status(200).json(savenewComment);
    } catch (error) {
        console.log(error);
    }

})




//get comments using userId
router.get("/:commentId", async (req, res) => {
    try {
        const comments = await Comments.find({
            commentId: req.params.commentId
        });

        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json(error)

    }

})

module.exports = router;