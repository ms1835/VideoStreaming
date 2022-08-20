// User Routes

const express = require('express')
const router = express.Router()
const {signupUser} = require('../controllers/user/user')
const {userVideos} = require('../controllers/video/video')

/*-------------------
    GET ROUTES
--------------------*/
router.get('/',userVideos)

/*-------------------
    POST ROUTES
--------------------*/

router.post('/',signupUser)
module.exports = router