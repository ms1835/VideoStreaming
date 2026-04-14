import mongoose from 'mongoose';

const playListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requires: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {timestamps:true});

export const PlayList = mongoose.model('PlayList', playListSchema);