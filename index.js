const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const commentsRoute = require("./routes/comments");
const multer = require('multer')
const path = require('path')
const cors = require('cors')
app.use(cors())
//call dotend 
dotenv.config();

//middleware-Functions that have access to the req/res/next 
//app.use(express.json()); is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());
// app.use(helmet());
//why comment out helmet??=>failed To Load Resource error//images were not showing
app.use(morgan("common"));



//connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("mongoDB connected!!!");
})

//what here saying is that=>if u use this /images path dont make any req but go into public/images folder instead.
app.use("/images", express.static(path.join(__dirname, "public/images")));


//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
//indicating destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});


app.use("/", (req, res) => {
    res.send("Welcome to social media app!!!")
})




//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comments", commentsRoute);




//imp => first req then res QS
app.get("/", (req, res) => {
    res.send("Welcome to Home Page!!!");
})

app.get("/users", (req, res) => {
    res.send("Welcome to user Page!!!");
})









//keep this is at the end
app.listen(8800, () => {
    console.log("Backend Running Succussefully!!!")
});