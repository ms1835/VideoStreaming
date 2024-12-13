import express from 'express';
import multer from 'multer'; // node.js middleware for handling multipart/form-data,primarily used for uploading files
import { uploadVideo, renderUploadVideoForm, likeVideo, unlikeVideo, videoById, deleteVideo } from '../controllers/video/video.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads');
  },
  filename: function(req,file,cb){
    cb(null,`${file.originalname}_${Date.now()}`);
  },
  // Optional
  // fileFilter: function(req,file,cb){

  // }
})
const upload = multer({storage: storage}).single('video');


/*----------------------
  GET ROUTES
------------------------*/
// router.get('/upload',[isLoggedIn],renderUploadVideoForm);
router.get('/:id', videoById);
/*----------------------
  POST ROUTES
------------------------*/
router.post('/:userID',uploadVideo); // restore middleware and route
router.post('/:id/like/:userID',likeVideo);  // restore middleware and route
router.post('/:id/unlike/:userID',unlikeVideo);  // restore middleware and route
/*----------------------
  DELETE ROUTES
------------------------*/
router.delete('/:id', deleteVideo);

export default router;