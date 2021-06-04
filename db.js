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

const insertToDB = async() =>{
    try{
        await user.insertMany([{
            email:'mayank@gmail.com',password:'mayank',type:'admin'
        },{
            email:'shweta@gmail.com',password:'shweta',type:'user'
        },{
            email:'chanda@gmail.com',password:'chanda',type:'user'
        },{
            email:'anamika@gmail.com',password:'anamika',type:'user'
        }])
        console.log("Insert success")
    }catch(err){
        console.log(err)
    }
}
insertToDB()