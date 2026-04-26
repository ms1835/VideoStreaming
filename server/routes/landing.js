import express from 'express';
import { displayAllVideosHome, relatedVideos } from '../controllers/video/video.js';

const router = express.Router();
/*----------------
     GET ROUTES
-----------------*/
router.get('/',displayAllVideosHome);
router.get('/semantic-search', relatedVideos);
export default router;