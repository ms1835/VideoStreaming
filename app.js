const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const {User} = require('./models/user')
dotenv.config()

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log("Connected to database")
}).catch((err)=>{
    console.log("Error")
    console.log(err)
})

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public',express.static('public'))
const authRoutes = require('./routes/auth/auth')
console.log("Hello")


app.get("/", (req,res)=>{
    try{
        res.render('./landing/home')
    }catch(err){
        console.log(err)
    } 
})

app.get('/login',(req,res)=>{
    try{
        res.render('login')
    }catch(err){
        console.log(err)
    }
})

app.get('/signup',(req,res)=>{
    try{
        res.render('signup')
    }catch(err){
        console.log(err)
    }
})

app.use('/auth',authRoutes)
app.post('/user',async (req,res)=>{
    try{
        const newUser={
            email:req.body.email,
            password:req.body.password
        }
        const salt = bcrypt.genSaltSync(10)
        newUser.password= bcrypt.hashSync(newUser.password,salt)
        const user = new User(newUser)
        await user.save()
        res.redirect('/')
    }catch(err){
        console.log(err)
        if(err.code===11000){
            console.log('User already exists')
        }
        res.redirect('/error')
    }
})

app.get('*',(req,res)=>{
    res.send("Error")
})

app.listen(process.env.PORT,()=>{
    console.log('Server has started at port ${process.env.PORT}.')
})