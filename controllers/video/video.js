// video controller
const {Video} = require('../../models/video')

// To upload video
const uploadVideo = async(req,res)=>{
    try{
        console.log('Logged in user is ')
        console.log(req.session.user)
        const {videoName,videoDescription} = req.body
        const newVideo={
            title: videoName,
            descriptoin: videoDescription,
            creator: req.session.user._id
        }
        const newUploadedVideo = new Video(newVideo)
        await newUploadedVideo.save()
        req.flash("success","Video Uploaded Successfully")
        res.redirect('/')
    }catch(err){
        req.flash('error','Something went wrong ${err.message}.')
        console.log(err)
        res.redirect('/error')
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
        console.log(foundVideos)
        res.render('./landing/home',{videos:foundVideos})
    }catch(err){
        console.log(err)
    }
}

module.exports={uploadVideo,renderUploadVideoForm,displayAllVideosHome}