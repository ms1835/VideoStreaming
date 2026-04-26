import mongoose from 'mongoose';

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
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            // Like, Unlike
            status:{
                type: String,
                enum:['LIKE','UNLIKE'],
                required: true
            }
        }
    ],
    commentsCount: {
        type: Number,
        default: 0
    },
    embedding: {
        type: [Number],
        index: false
    }
}, {timestamps:true});

export const Video = mongoose.model('Video',videoSchema);