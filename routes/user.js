// User Routes

import express from 'express';
import { signupUser } from '../controllers/user/user.js';
import { userVideos } from '../controllers/video/video.js';

const router = express.Router();

/*-------------------
    GET ROUTES
--------------------*/
router.get('/',userVideos);

/*-------------------
    POST ROUTES
--------------------*/

router.post('/',signupUser);

export default router;