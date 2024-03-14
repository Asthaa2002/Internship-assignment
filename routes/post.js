const express = require('express');
const postController = require('../controllers/post');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads/");
    },
    filename: function(req,file,cb){
             cb(null,file.originalname);
    },
});
const upload = multer({storage: storage})
const router = express.Router();
router.post('/create_post',upload.single('file'),postController.createPost);
router.post("/like_post/:id", postController.likePost)
router.post("/share_post/:id", postController.sharePost)
router.post("/comment_on_post/:id", postController.commentOnPost);
router.get("/retrieve_posts",postController.retrievePosts);
router.put("/update_post/:postid",upload.single('file'),postController.updatePost);
router.delete('/delete_post/:id',postController.deletePost);

module.exports= router;
