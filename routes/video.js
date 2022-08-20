const express = require('express')
const router = express.Router()
const multer = require('multer') // node.js middleware for handling multipart/form-data,primarily used for uploading files
const {uploadVideo,renderUploadVideoForm,likeVideo,unlikeVideo} = require('../controllers/video/video')
const {isLoggedIn} = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads')
  },
  filename: function(req,file,cb){
    cb(null,`${file.originalname}_${Date.now()}`)
  },
  // Optional
  // fileFilter: function(req,file,cb){

  // }
})
const upload = multer({storage: storage}).single('video')


/*----------------------
  GET ROUTES
------------------------*/
router.get('/upload',[isLoggedIn],renderUploadVideoForm)
/*----------------------
  POST ROUTES
------------------------*/
router.post('/',[isLoggedIn,upload],uploadVideo)
router.post('/:id/like',[isLoggedIn],likeVideo)
router.post('/:id/unlike',[isLoggedIn],unlikeVideo)
module.exports = router