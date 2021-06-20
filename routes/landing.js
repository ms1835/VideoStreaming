const express = require('express')
const router = express.Router()
const {displayAllVideosHome} = require('../controllers/video/video')
/*----------------
     GET ROUTES
-----------------*/
router.get('/',displayAllVideosHome)

module.exports = router