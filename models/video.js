const mongoose = require('mongoose')

const videoSchema= new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String,
        // required:true
    },
    likes:{
        type:Number,
        default:0
    },
    unlikes:{
        type:Number,
        default:0
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    filePath:{
        type: String
    },
    fileType: {
        type: String
    },
    // Denormalization
    reaction:[
        {
            id: String,
            // Like, Unlike
            status:{
                type: String,
                enum:['LIKE','UNLIKE']
            }
        }
    ]
}, {timestamps:true})
const Video = mongoose.model('Video',videoSchema)
module.exports={Video}