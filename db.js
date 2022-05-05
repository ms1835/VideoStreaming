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


const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    }
}, {timestamps:true})

const user = mongoose.model('User',userSchema)

