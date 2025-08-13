if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Chat = require("./models/chat.js");
const {isAdmin, isLoggedIn} = require("./middleware.js");
// const {exec} = require("child_process");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{

        console.log("connected to DB");
    })
     .catch((err)=>{

        console.log(err);
     });

async function main(){

    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
// app.use(express.json);
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

const sessionOptions = {

    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// app.get("/", (req, res)=>{

//     res.send("root is working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// demo User
// app.get("/demoUser", async(req, res)=>{

//     let fakeUser = new User({

//         email: "collegeStu321@gmail.com",
//         username: "mba-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// const Chat = require('./models/chat');

// Show all user messages to Admin
app.get('/admin/chats',isLoggedIn, isAdmin, async (req, res) => {
    // You should check if user is admin here, but for now keep it simple
    const chats = await Chat.find({}).populate('userId'); // fetch user details too
    res.render("chats/adminChat.ejs", { chats });
});

app.post('/admin/chats/:id/reply', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;
    await Chat.findByIdAndUpdate(id, { reply: reply });
    res.redirect('/admin/chats');
});


app.all("*", (req, res, next)=>{

    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=>{

    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

// app.listen(8080, ()=>{

//     console.log("app is listening on port 8080");
//     // exec("start http://localhost:8080/listings");
// });

const server = app.listen(8080, () => {
    console.log("Server started on port 8080");
    // exec("start http://localhost:8080/listings");
});

const { Server } = require("socket.io");
// const { isAdmin } = require('./middleware.js');
const io = new Server(server);

// const Chat = require('./models/chat');

io.on('connection', (socket) => {
    // console.log('a user connected');

    socket.on('chat message', async (data) => {
        const { userId, message, sentBy } = data;
        const chat = new Chat({ userId, message, sentBy });
        await chat.save();
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});



