// video controller
const { User } = require('../../models/user')
const {Video} = require('../../models/video')

// To upload video
const uploadVideo = async(req,res)=>{
    try{
        console.log('Logged in user is ')
        console.log(req.session.user)
        const {videoName,videoDescription} = req.body
        const newVideo={
            title: videoName,
            description: videoDescription,
            creator: req.session.user._id,
            filePath: req.file.path,
            fileType: req.file.mimetype
        }
        console.log(req.body)
        console.log(req.file)

        const newUploadedVideo = new Video(newVideo)
        await newUploadedVideo.save()
        req.flash("success","Video Uploaded Successfully")
        res.redirect('/')
    }catch(err){
        req.flash('error',`Something went wrong ${err.message}.`)
        console.log(err)
        // TODO Remove from filesystem ( fs )
        res.redirect('/error')
    }
}

const likeVideo = async(req,res)=>{
    try{
        const videoId = req.params.id
        const foundVideo = await Video.findById(videoId)
        console.log(foundVideo)
        let isLiked = false,isUnliked = false
        for(const user of foundVideo.reaction){
            if(req.session.user._id.toString()===user.id){
                if(user.status==='LIKE'){
                    isLiked = true
                }else if(user.status==='UNLIKE'){
                    isUnliked = true
                }
            }
        }
        if(isLiked){
            console.log('Video is already liked')
        }else{
            foundVideo.likes++
            if(isUnliked){
                foundVideo.unlikes--
                for(const user of foundVideo.reaction){
                    if(req.session.user._id.toString()===user.id){
                        user.status = 'LIKE'
                        break
                    }
                }
                await foundVideo.save()
            }else{
                let userStat={
                    id: req.session.user._id.toString(),
                    status: 'LIKE'
                }
                foundVideo.reaction.push(userStat)
                await foundVideo.save()
            }
        }
        res.redirect('/')
    }catch(err){
        console.log(err)
    }
}

const unlikeVideo = async(req,res)=>{
    try{
        const videoId = req.params.id
        const foundVideo = await Video.findById(videoId)
        console.log(foundVideo)
        let isLiked = false,isUnliked = false
        for(const user of foundVideo.reaction){
            if(req.session.user._id.toString()===user.id){
                if(user.status==='LIKE'){
                    isLiked = true
                }else if(user.status==='UNLIKE'){
                    isUnliked = true
                }
            }
        }
        if(isUnliked){
            console.log('Video is already unliked')
        }else{
            foundVideo.unlikes++
            if(isLiked){
                foundVideo.likes--
                for(const user of foundVideo.reaction){
                    if(req.session.user._id.toString()===user.id){
                        user.status = 'UNLIKE'
                        break
                    }
                }
                await foundVideo.save()
            }else{
                let userStat={
                    id: req.session.user._id.toString(),
                    status: 'UNLIKE'
                }
                foundVideo.reaction.push(userStat)
                await foundVideo.save()
            }
        }
        res.redirect('/')
    }catch(err){
        console.log(err)
    }
}

// To display form
const renderUploadVideoForm = async(req,res)=>{
    try{
        res.render('uploadVideo')
    }catch(err){
        req.flash('error','Something went wrong ${err.message}.')
        console.log(err)
        res.redirect('/error')
    }
}

//To display all videos on home
const displayAllVideosHome = async(req,res)=>{
    try{
        const foundVideos = await Video.find({}).populate('creator','name email')
        // console.log(foundVideos)
        res.render('./landing/home',{videos:foundVideos})
    }catch(err){
        console.log(err)
    }
}

const userVideos = async(req,res)=>{
    try{
        const foundVideos = await Video.find({creator:req.session.user})
        res.render('./user',{videos:foundVideos})
    }catch(err){
        console.log(err)
    }
}

const specificVideo = async(req,res)=>{
    try{
        const videoId = req.params.id
        const foundVideo = await Video.findById(videoId)
        const foundUser = await User.findById(foundVideo.creator)
        res.render('./singleVideo',{video:foundVideo, user:foundUser})
    }catch(err){
        console.log(err)
    }
}

module.exports={uploadVideo,renderUploadVideoForm,displayAllVideosHome,likeVideo,unlikeVideo,userVideos, specificVideo}