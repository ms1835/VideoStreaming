// video controller
import { User } from '../../models/User.js';
import { Video } from '../../models/Video.js';
import { Comment } from '../../models/Comment.js';
import { Subscription } from '../../models/Subscription.js';
import cloudinary from "cloudinary";
import fs from "fs";

const MAX_VIDEO_SIZE = 25 * 1024 * 1024;

// To upload video
export const uploadVideo = async(req,res) => {
    try{
        // console.log(req.session.user);
        console.log("Request body: ",req.body);
        const userID = req.params.userID;
        const {title,description} = req.body;
        const video = req.files.video.tempFilePath;

        if(req.files.video.size > MAX_VIDEO_SIZE){
            return res.status(400).json({
                success: false,
                message: `File size exceeds the limit of ${MAX_VIDEO_SIZE / (1024*1024)} MB.`
            })
        }

        const cloud = await cloudinary.v2.uploader.upload(video, {
            folder: "VideoStreaming/videos",
            resource_type: "video"
        });

        try{
            fs.rmSync("./tmp", {recursive: true});
        } catch(err) {
            console.log("Error while removing temp folder: ", err);
        }

        const newVideo={
            title,
            description,
            creator: userID, // req.session.user._id,
            filePath: cloud.secure_url,
            fileType: req.files.video.mimetype
        };

        const newUploadedVideo = new Video(newVideo);
        await newUploadedVideo.save();
        // req.flash("success","Video Uploaded Successfully");
        res.json({
            success: true,
            message: "Video uploaded successfully"
        })
        // res.redirect('/');
    }catch(err){
        req.flash('error',`Something went wrong ${err.message}.`);
        console.log(err);
        // TODO Remove from filesystem ( fs )
        // res.redirect('/error');
        res.json({
            success: false,
            message: err.message
        })
    }
}

export const likeVideo = async(req,res) => {
    try{
        const videoId = req.params.id;
        const userID = req.params.userID;
        const foundVideo = await Video.findById(videoId);
        console.log(foundVideo);
        let isLiked = false,isUnliked = false;
        for(const user of foundVideo.reaction){
            if(userID === user.id){ // req.session.user._id.toString()===user.id
                if(user.status==='LIKE'){
                    isLiked = true;
                }else if(user.status==='UNLIKE'){
                    isUnliked = true;
                }
            }
        }
        if(isLiked){
            console.log('Video is already liked');
            return res.json({
                success: false,
                message: "You have already liked this video."
            })
        }
        else{
            foundVideo.likes++;
            if(isUnliked){
                foundVideo.unlikes--;
                for(const user of foundVideo.reaction){
                    if(userID === user.id){ // req.session.user._id.toString()===user.id
                        user.status = 'LIKE';
                        break;
                    }
                }
                await foundVideo.save();
            }else{
                let userStat={
                    id: userID, // req.session.user._id.toString()
                    status: 'LIKE'
                };
                foundVideo.reaction.push(userStat);
                await foundVideo.save();
            }
        }
        // res.redirect('/');
        return res.json({
            success: true,
            message: "Yay!,you liked the video"
        })
    }
    catch(err){
        console.log(err);
    }
}

export const unlikeVideo = async(req,res) => {
    try{
        const videoId = req.params.id;
        const userID = req.params.userID;
        const foundVideo = await Video.findById(videoId);
        console.log(foundVideo);
        let isLiked = false,isUnliked = false;
        for(const user of foundVideo.reaction){
            if(userID === user.id){ // req.session.user._id.toString()
                if(user.status==='LIKE'){
                    isLiked = true;
                }else if(user.status==='UNLIKE'){
                    isUnliked = true;
                }
            }
        }
        if(isUnliked){
            console.log('Video is already unliked');
            return res.json({
                success: false,
                message: "You have already disliked this video."
            })
        }else{
            foundVideo.unlikes++;
            if(isLiked){
                foundVideo.likes--;
                for(const user of foundVideo.reaction){
                    if(userID === user.id){ // req.session.user._id.toString()
                        user.status = 'UNLIKE';
                        break;
                    }
                }
                await foundVideo.save();
            }else{
                let userStat={
                    id: userID, // req.session.user._id.toString()
                    status: 'UNLIKE'
                };
                foundVideo.reaction.push(userStat);
                await foundVideo.save();
            }
        }
        // res.redirect('/');
        return res.json({
            success: true,
            message: "You have disliked the video"
        })
    }
    catch(err){
        console.log(err);
    }
}

// To display form
export const renderUploadVideoForm = async(req,res) => {
    try{
        // res.render('uploadVideo');
    }catch(err){
        req.flash('error','Something went wrong ${err.message}.');
        console.log(err);
        // res.redirect('/error');
    }
}

//To display all videos on home
export const displayAllVideosHome = async(req,res) => {
    try{
        const foundVideos = await Video.find({}).populate('creator','name email');
        // console.log(foundVideos)
        // res.render('./landing/home',{videos:foundVideos});
        res.json({
            success: true,
            data: foundVideos,
            message: "Yay!, Welcome to Vines!"
        })
    }catch(err){
        console.log(err);
    }
}

export const userVideos = async(req,res) => { // changed implementation to take userId as params instead of req.session.user
    try{
        console.log("User: ",req.params.userID);
        const foundVideos = await Video.find({creator:req.params.userID});
        const foundUser = await User.findById(req.params.userID);

        let isSubscribed = false;
        if(req.query.currentUserID && req.query.currentUserID !== req.params.userID){
            isSubscribed = Boolean(await Subscription.exists({
                subscriber: req.query.currentUserID,
                subscribedTo: req.params.userID
            }));
        }

        res.json({
            success: true,
            data: foundVideos,
            user: foundUser,
            isSubscribed,
            message: `Fetched channel videos successfully`
        })
    }catch(err){
        console.log(err);
    }
}

const buildNestedComments = (comments) => {
    const commentMap = new Map();
    comments.forEach(comment => {
        commentMap.set(comment._id.toString(), {
            ...comment.toObject(),
            replies: []
        });
    });

    const nested = [];
    comments.forEach(comment => {
        const commentId = comment._id.toString();
        const parentId = comment.parentComment ? comment.parentComment.toString() : null;
        if (parentId && commentMap.has(parentId)) {
            commentMap.get(parentId).replies.push(commentMap.get(commentId));
        } else {
            nested.push(commentMap.get(commentId));
        }
    });
    return nested;
};

export const getCommentsByVideo = async(req,res) => {
    try{
        const videoId = req.params.id;
        const comments = await Comment.find({video: videoId})
            .populate('creator','name email')
            .sort({createdAt: 1});
        const nestedComments = buildNestedComments(comments);
        return res.json({
            success: true,
            data: nestedComments,
            message: "Comments fetched successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch comments"
        });
    }
};

export const createComment = async(req,res) => {
    try{
        const videoId = req.params.id;
        const { content, parentComment, userId } = req.body;

        if(!content || !content.trim()){
            return res.status(400).json({
                success: false,
                message: "Comment content cannot be empty"
            });
        }
        if(!userId){
            return res.status(401).json({
                success: false,
                message: "User is required to post a comment"
            });
        }

        const video = await Video.findById(videoId);
        if(!video){
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        const comment = new Comment({
            content: content.trim(),
            creator: userId,
            video: videoId,
            parentComment: parentComment || null
        });

        await comment.save();
        await Video.findByIdAndUpdate(videoId, {$inc: {commentsCount: 1}});

        const savedComment = await Comment.findById(comment._id)
            .populate('creator','name email');

        return res.status(201).json({
            success: true,
            data: savedComment,
            message: "Comment posted successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to create comment"
        });
    }
};

export const videoById = async(req,res)=>{
    try {
        const videoId = req.params.id;
        const foundVideo = await Video.findById(videoId).populate('creator','name email');
        if(!foundVideo) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        const comments = await Comment.find({video: videoId})
            .populate('creator','name email')
            .sort({createdAt:1});
        const nestedComments = buildNestedComments(comments);

        res.json({
            success: true,
            data: foundVideo,
            comments: nestedComments,
            message: "Video fetched successfully"
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Unable to fetch video"
        });
    }
}

export const deleteVideo = async(req,res)=>{
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
        if(!video)
            return res.status(404).json({
                success: false,
                message: "Video not found"
        })

        const publicId = video.filePath.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(`VideoStreaming/videos/${publicId}`, {
            resource_type: "video"
        });
        await Video.findByIdAndDelete(videoId);
        res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Failed to delete video"
        })
    }
}
