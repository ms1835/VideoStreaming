const express = require('express')
const router = express.Router()
const {renderLoginForm, loginUser}=require('../../controllers/auth/auth')
/*------------------------
   GET ROUTES
--------------------------*/
//@ROUTE GET /auth/login
//@DESC Displays Login Form
//@ACCESS PUBLIC
router.get('/login', renderLoginForm)



/*------------------------
   POST ROUTES
--------------------------*/
router.post('/login',loginUser)
module.exports=router