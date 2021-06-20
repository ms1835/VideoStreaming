// User Routes

const express = require('express')
const router = express.Router()
const {signupUser} = require('../controllers/user/user')
/*-------------------
    POST ROUTES
--------------------*/
router.post('/',signupUser)
module.exports = router