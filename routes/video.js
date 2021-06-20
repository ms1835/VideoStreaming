const express = require('express')
const router = express.Router()
const {uploadVideo,renderUploadVideoForm} = require('../controllers/video/video')
/*----------------------
  GET ROUTES
------------------------*/
router.get('/upload',renderUploadVideoForm)
/*----------------------
  POST ROUTES
------------------------*/
router.post('/',uploadVideo)
module.exports = router