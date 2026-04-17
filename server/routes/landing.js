import express from 'express';
import { displayAllVideosHome, semanticSearch } from '../controllers/video/video.js';

const router = express.Router();
/*----------------
     GET ROUTES
-----------------*/
router.get('/',displayAllVideosHome);
router.get('/semantic-search', semanticSearch);
export default router;