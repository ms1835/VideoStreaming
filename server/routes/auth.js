import express from 'express';
const router = express.Router();
import { renderLoginForm, loginUser,logout,renderSignUpPage } from '../controllers/auth/auth.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

/*------------------------
   GET ROUTES
--------------------------*/
//@ROUTE GET /auth/login
//@DESC Displays Login Form
//@ACCESS PUBLIC
// router.get('/login', renderLoginForm);
// For logout
router.get('/logout',logout); // restore middleware
// router.get('/signup',renderSignUpPage);

/*------------------------
   POST ROUTES
--------------------------*/
router.post('/login',loginUser);

export default router;