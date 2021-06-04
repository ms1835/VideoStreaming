const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
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

console.log("Hello")



app.get("/", (req,res)=>{
    res.send("Hello there");    
});
app.get("/video", (req,res)=>{
    res.send("Hello");    
});
app.get("/video:id", (req,res)=>{
    res.send("Video by a particular id ${id}"); 
});
app.get('*',(req,res)=>{
    res.send("Error")
})

app.listen(process.env.PORT,()=>{
    console.log('Server has started at port ${process.env.PORT}.')
})