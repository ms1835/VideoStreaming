const mongoose = require('mongoose')

const videoSchema= new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
}, {timestamps:true})
const video = mongoose.model('Video',videoSchema)
module.exports={video}