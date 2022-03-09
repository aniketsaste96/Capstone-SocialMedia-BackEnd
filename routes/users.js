const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
//here we will write logic for backend CRUD
//update user
//delete user
//get a user
//follwo user
//unfollowe user

//UPDATE=>PUT

router.put("/:id", async (req, res) => {

    //user must able to edit only his/her account not others
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {

            try {
                //generate password again

                const salt = await bcrypt.genSalt(10);
                //update password
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (error) {
                console.log(error)

            }

            //update actual user in db 

            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    //automatically set all input in body
                    $set: req.body
                });

                res.status(200).json("You account has been Updated!!!");

            } catch (error) {
                console.log(error)
            }


        } else {
            return res.status(403).json("OPPS SOMETHING IS WRONG IN WPDATING!!!")
            //HTTP 403 is a HTTP status code meaning access to the requested resource is forbidden for some reason. 
        }
    } else {
        return res.status(403).json("You can update Only your account")
        //HTTP 403 is a HTTP status code meaning access to the requested resource is forbidden for some reason. 
    }

})

//DELETE=>delete

router.delete("/:id", async (req, res) => {

    //user must able to delete only his/her account not others
    if (req.body.userId === req.params.id || req.body.isAdmin) {


        //delete actual user in db 

        try {
            await User.findByIdAndDelete(req.params.id)

            res.status(200).json("Your account has been deleted!!!");

        } catch (error) {
            console.log(error)
        }

    } else {
        return res.status(403).json("You can delete Only your account")
        //HTTP 403 is a HTTP status code meaning access to the requested resource is forbidden for some reason. 
    }

})

//get as user=> get

router.get("/", async (req, res) => {
    try {
        const userId = req.query.userId;
        const username = req.query.username;
        //find the user by id and send respinse as user in json
        //await due to async funtion always use async function while dealung with db.
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        //this is returinig all data including password and updayted at we don't need that 

        const { password, updatedAt, ...others } = user._doc;
        //here now return only others excluding pass,updatedAt
        res.status(200).json(others);

    } catch (error) {
        //show error if user is not found in data base
        res.status(500).json(error);
    }
})



//get friends by using userId

router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            //here followings are array wathc db
            user.followers.map(friendId => {
                return User.findById(friendId);
            })

        )
        //now friends includes all property of user we dont want that
        let friendList = [];
        friends.map(friend => {
            //destructuring friend
            const { _id, username, profilePicture } = friend;
            //push into friendList
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList);

    } catch (error) {
        res.status(500).json(error)
    }
})

























//follow user=> put beacuse we are going to update lists;
router.put("/:id/follow", async (req, res) => {
    //you cannot follow yourself
    //check if user are same if 
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed!!!")

            } else {
                res.status(403).json("You already followed this user!!!");
            }

        } catch (error) {

        }

    }
})

//unfollow
router.put("/:id/unfollow", async (req, res) => {
    //you cannot follow yourself
    //check if user are same if 
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed!!!")

            } else {
                res.status(403).json("You already unfollowed this user!!!");
            }

        } catch (error) {
            res.status(403).json("You cannot unfollowed yourself!!!");
        }

    }
})

module.exports = router;

//exports not