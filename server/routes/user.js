// User Routes

import express from 'express';
import { signupUser, subscribe, subscriptionStatus } from '../controllers/user/user.js';
import { userVideos } from '../controllers/video/video.js';

const router = express.Router();

/*-------------------
    GET ROUTES
--------------------*/
router.get('/subscription-status', subscriptionStatus);
router.get('/:userID',userVideos); // changed route

/*-------------------
    PUT ROUTES
--------------------*/
router.put('/subscribe', subscribe);

/*-------------------
    POST ROUTES
--------------------*/

router.post('/',signupUser);

export default router;