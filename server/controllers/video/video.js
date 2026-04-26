// video controller
import { User } from '../../models/User.js';
import { Video } from '../../models/Video.js';
import { Comment } from '../../models/Comment.js';
import { Subscription } from '../../models/Subscription.js';
import cloudinary from "cloudinary";
import fs from "fs";
// import { indexVideo } from '../../indexVideo.js';
import { getEmbedding } from '../../embedding.js';
// import qdrant from '../../qdrant.js';
import {  indexVideoByAtlas } from '../../indexOSVideo.js';
import { getBedrockEmbedding } from "../../bedrock.js";
// import { openSearchClient } from "../../openSearch.js";

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
        // indexOSVideo(newUploadedVideo).catch(err => console.log("Error in indexing video: ", err));
        indexVideoByAtlas(newUploadedVideo).catch(err => console.log("Error in indexing video: ", err));

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
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 9, 1);
        const search = req.query.search ? req.query.search.trim() : "";

        const filter = {};
        if(search){
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const totalVideos = await Video.countDocuments(filter);
        const totalPages = totalVideos > 0 ? Math.ceil(totalVideos / limit) : 1;
        const currentPage = Math.min(page, totalPages);
        const skip = (currentPage - 1) * limit;

        const foundVideos = await Video.find(filter)
            .populate('creator','name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            data: foundVideos,
            pagination: {
                page: currentPage,
                limit,
                totalPages,
                totalVideos,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage < totalPages
            },
            message: "Yay!, Welcome to Vines!"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Unable to fetch videos"
        });
    }
}

export const userVideos = async(req,res) => { // changed implementation to take userId as params instead of req.session.user
    try{
        console.log("User: ",req.params.userID);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 9, 1);
        const search = req.query.search ? req.query.search.trim() : "";

        const filter = { creator: req.params.userID };
        if(search){
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const totalVideos = await Video.countDocuments(filter);
        const totalPages = totalVideos > 0 ? Math.ceil(totalVideos / limit) : 1;
        const currentPage = Math.min(page, totalPages);
        const skip = (currentPage - 1) * limit;

        const foundVideos = await Video.find(filter)
            .populate('creator','name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

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
            pagination: {
                page: currentPage,
                limit,
                totalPages,
                totalVideos,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage < totalPages
            },
            isSubscribed,
            message: `Fetched channel videos successfully`
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Unable to fetch channel videos"
        });
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

// export const semanticSearch = async(req, res) => {
//     try {
//         console.log("IN semantic search API");
//         const { search: query } = req.query;
//         const page = Math.max(parseInt(req.query.page, 10) || 1, 2);
//         const limit = Math.max(parseInt(req.query.limit, 10) || 9, 2);

//         if (!query || typeof query !== 'string' || !query.trim()) {
//             const totalVideos = await Video.countDocuments();
//             const totalPages = totalVideos > 0 ? Math.ceil(totalVideos / limit) : 1;
//             const currentPage = Math.min(page, totalPages);
//             const skip = (currentPage - 1) * limit;

//             const foundVideos = await Video.find()
//                 .populate('creator', 'name email')
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(limit);

//             return res.json({
//                 success: true,
//                 data: foundVideos,
//                 pagination: {
//                     page: currentPage,
//                     limit,
//                     totalPages,
//                     totalVideos,
//                     hasPrevPage: currentPage > 1,
//                     hasNextPage: currentPage < totalPages
//                 },
//                 message: "Fetched all videos"
//             });
//         }

//         console.log("Search query:", query);
//         const queryEmbedding = await getEmbedding(query);
//         console.log("Query embedding obtained successfully");
//         const result = await qdrant.search('video_embeddings', {
//             vector: queryEmbedding,
//             limit: 10,
//             with_payload: true
//         });
//         console.log("Search completed successfully, result count:", result.length);
//         const videoIds = result.map(item => item.payload.id);
//         const videos = await Video.find({_id: { $in: videoIds}}).populate('creator', 'name email');
//         const orderedVideos = videoIds.map(id => videos.find(video => video._id.toString() === id));
//         res.json({
//             success: true,
//             data: orderedVideos,
//             pagination: {
//                 page: 1,
//                 limit: orderedVideos.length,
//                 totalPages: 1,
//                 totalVideos: orderedVideos.length,
//                 hasPrevPage: false,
//                 hasNextPage: false
//             }
//         });
//     } catch(err) {
//         console.error("Semantic search error:", err);
//         res.status(500).json({
//             success: false,
//             message: "Semantic search failed"
//         });
//     }
// }

// export const trendingVideos = async(req, res) => {
//     try {
//         const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
//         const limit = Math.max(parseInt(req.query.limit, 10) || 9, 1);
//         const { search: query } = req.query;

//         const totalVideos = await Video.countDocuments;
//         const totalPages = totalVideos > 0 ? Math.ceil(totalVideos / limit) : 1;
//         const currentPage = Math.min(page, totalPages);
//         const skip = (currentPage - 1) * limit;

//         const queryEmbedding = await getBedrockEmbedding(query || "trending videos");
//         const osResult = await openSearchClient.search({
//             index: 'videos',
//             body: {
//                 size: 10,
//                 query: {
//                     knn: {
//                         embedding: {
//                             vector: queryEmbedding,
//                             k: 10
//                         }
//                     }
//                 }
//             }
//         });
//         const videoIds = osResult.body.hits.hits.map(hit => hit._source.videoId);
//         const videos = await Video.find({_id: { $in: videoIds}}).populate('creator', 'name email');
//         const orderedVideos = videoIds.map(id => videos.find(video => video._id.toString() === id));
//         res.json({
//             success: true,
//             data: orderedVideos,
//             pagination: {
//                 page: currentPage,
//                 limit,
//                 totalPages,
//                 totalVideos,
//                 hasPrevPage: currentPage > 1,
//                 hasNextPage: currentPage < totalPages
//             },
//             message: "Fetched trending videos successfully"
//         });
//     } catch(err) {
//         console.error("Error fetching trending videos:", err);
//         res.status(500).json({
//             success: false,
//             message: "Unable to fetch trending videos"
//         });
//     }
// }

export const relatedVideos = async(req, res) => {
    try {
        const { search: query } = req.query;
        if (!query || typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Related videos search query cannot be empty"
            });
        }
        const searchQuery = `
        Search Query: ${query}
        Related videos to the above search query
        `;
        const queryEmbedding = await getBedrockEmbedding(searchQuery);
        if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Unable to compute embedding for related videos"
            });
        }

        const results = await Video.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index_videos",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    numCandidates: 100,
                    limit: 10
                }
            },
            {
                $addFields: {
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { score: { $gte: 0.7 } }
                    ]
                }
            }
        ]);
        console.log("Related videos search results count:", results.length);
        res.json({
            success: true,
            data: results,
            message: "Fetched related videos successfully"
        });

    } catch(err) {
        console.error("Error fetching related videos:", err);
        res.status(500).json({
            success: false,
            message: "Unable to fetch related videos"
        });
    }
};