import express from 'express';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import landingRoutes from './routes/landing.js';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";


const app = express();
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true
    })
);

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Database Connection
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true, /*useCreateIndex: true*/})
.then(()=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log("Error");
    console.log(err);
});

// app.set("view engine","ejs");
// Middleware functions

app.use(cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET","POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    
}))

app.use(express.json());// (middleware) recognise incoming request object as json object
app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());
app.use(flash()); // define a flash message and render it without redirecting request
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_URL, // MongoDB connection URL
        collection: 'sessions', // Name of the collection to store sessions (optional)
      }),
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 1000*60*60, // 1 hour,
        // path: '/',
        // domain: '.onrender.com',
        // httpOnly: false
    }
}));

// Custom middleware
// app.use(function(req,res,next){
//     if(req.session.isLoggedIn){
//         res.locals.currentUser = req.session.user;
//     }else{
//         res.locals.currentUser = null;
//     }
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next()
// })

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
app.get('/',(req,res)=>{
    try {
        res.send('Server is working.');
    }
    catch(err) {
        console.log(err);
    } 
});

// app.get('*',(req,res)=>{
//     res.send("Please enter a valid route");
// })

app.listen(process.env.PORT, ()=>{
    console.log(`Server has started at http://localhost:${process.env.PORT}`);
})


