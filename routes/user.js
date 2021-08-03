// User Routes

const express = require('express')
const router = express.Router()
const {signupUser} = require('../controllers/user/user')
const {userVideos} = require('../controllers/video/video')

/*-------------------
    POST ROUTES
--------------------*/
router.get('/',userVideos)

/*-------------------
    POST ROUTES
--------------------*/

router.post('/',signupUser)
module.exports = router