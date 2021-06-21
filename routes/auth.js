const express = require('express')
const router = express.Router()
const {renderLoginForm, loginUser,logout,renderSignUpPage}=require('../controllers/auth/auth')
const {isLoggedIn} = require('../middleware/authMiddleware')

/*------------------------
   GET ROUTES
--------------------------*/
//@ROUTE GET /auth/login
//@DESC Displays Login Form
//@ACCESS PUBLIC
router.get('/login', renderLoginForm)
// For logout
router.get('/logout',[isLoggedIn],logout)
router.get('/signup',renderSignUpPage)

/*------------------------
   POST ROUTES
--------------------------*/
router.post('/login',loginUser)
module.exports=router