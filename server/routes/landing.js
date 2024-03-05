import express from 'express';
import { displayAllVideosHome } from '../controllers/video/video.js';

const router = express.Router();
/*----------------
     GET ROUTES
-----------------*/
router.get('/',displayAllVideosHome);

export default router;