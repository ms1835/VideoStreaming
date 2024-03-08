// video controller
import { User } from '../../models/user.js';
import {Video} from '../../models/video.js';

// To upload video
export const uploadVideo = async(req,res) => {
    try{
        console.log('Logged in user is ');
        // console.log(req.session.user);
        console.log("Request body: ",req.body);
        const userID = req.params.userID;
        const {title,description} = req.body;
        const newVideo={
            title,
            description,
            creator: userID, // req.session.user._id,
            filePath: req.file.path,
            fileType: req.file.mimetype
        };
        console.log(req.body);
        console.log(req.file);

        const newUploadedVideo = new Video(newVideo);
        await newUploadedVideo.save();
        req.flash("success","Video Uploaded Successfully");
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
            message: err
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
            res.json({
                success: false,
                message: "Video already liked"
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
        res.json({
            success: true,
            message: "You have liked the video"
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
            res.json({
                success: false,
                message: "Video already disliked"
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
        res.json({
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
            message: "Display all videos"
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
        // res.render('./user',{videos:foundVideos});
        res.json({
            success: true,
            data: foundVideos,
            user: foundUser,
            message: "Fetched user videos successfully"
        })
    }catch(err){
        console.log(err);
    }
}

export const specificVideo = async(req,res)=>{
    try {
        const videoId = req.params.id;
        const foundVideo = await Video.findById(videoId);
        const foundUser = await User.findById(foundVideo.creator);
        // res.render('./singleVideo',{video:foundVideo, user:foundUser});
    }
    catch(err) {
        console.log(err);
    }
}

export const deleteVideo = async(req,res)=>{
    try {
        const videoId = req.params.id;
        await Video.deleteOne(videoId);
        console.log("Video Deleted");
        const foundVideos = await Video.find({creator:req.session.user});
        res.render('./user',{videos:foundVideos});
    }
    catch(err) {
        console.log(err);
    }
}
