import express from 'express';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import landingRoutes from './routes/landing.js';
import cors from 'cors';

const app = express();
dotenv.config();

// Database Connection
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true, /*useCreateIndex: true*/})
.then(()=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log("Error");
    console.log(err);
});

app.set("view engine","ejs");
// Middleware functions

app.use(cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET","POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    
}))

app.use(express.json());// (middleware) recognise incoming request object as json object
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(flash()); // define a flash message and render it without redirecting request
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    keys: ['x','y']
}));

// Custom middleware
app.use(function(req,res,next){
    if(req.session.isLoggedIn){
        res.locals.currentUser = req.session.user;
    }else{
        res.locals.currentUser = null;
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
})

app.use('/public',express.static('public')); // serve static files
app.use('/uploads',express.static('uploads'));

// Routes
app.get('/',landingRoutes);
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/video',videoRoutes);


/*
----------------------------
----------------------------
TODO Confirm Password implementation
*/
app.get('/user',(req,res)=>{
    try {
        res.render('user');
    }
    catch(err) {
        console.log(err);
        res.redirect('/error');
    } 
})

app.get('/error',(req,res)=>{
    try {
        res.render('error');
    }
    catch(err) {
        console.log(err);
    }
})

app.get('*',(req,res)=>{
    res.send("Error from here");
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server has started at https://localhost:${process.env.PORT}`);
})


