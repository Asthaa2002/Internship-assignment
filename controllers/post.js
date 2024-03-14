const postSchema = require('../models/post');
const fs = require('fs').promises;

exports.createPost =async(req,res) => {
    try{
const {postName,postBy,content }= req.body;
if(!req.file) {
    return res.status(400).json({message: "No files uploaded"});

}
const{filename,path} = req.file;
const post =await postSchema({
    postName,
    postBy,
    media: {
        name:filename,
        path:path
    },
    content
});
const result = await post.save();
res.status(201).json({message: "post created successfully", result: result});

    }
    catch(error){
console.log(error);
return res.status(500).json({message: " Internal server error!"})
    }
}
exports.likePost = async(req,res) => {
    const {id}= req.params;
    try{
        const findPost = await postSchema.findById(id);
        if(!findPost) {
            return res.status(404).json({message: "No post found"});

        } 
        
        findPost.likes++;
        await findPost.save();
        res.status(200).json({message: "post liked successfully",likes: findPost.likes})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});

    }
}
exports.sharePost = async (req, res) => {
    const { id } = req.params;
    try {
      const findPost = await postSchema.findById(id);
      if (!findPost) {
        return res.status(404).json({ message: "No post found!" });
      }
  
      findPost.shares++;
      await findPost.save();
      res
        .status(200)
        .json({ message: "post shared successfully!", shares: findPost.shares });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error !!" });
    }
  };

  exports. commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { commentedBy, commentedData } = req.body;
    try {
      const findPost = await postSchema.findById(id);
      if (!findPost) {
        return res.status(404).json({ message: "No post found!" });
      }
  
      const newComment = {
        commentedBy: commentedBy,
        commentedData: commentedData,
      };
  
      findPost.comments.push(newComment);
      const result = await findPost.save();
  
      console.log(result);
      res.status(201).json({ message: "Comment added successfully !", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error !!" });
    }
  }; 
 


exports.retrievePosts = async(req,res)=> {
    try{
    const  findPost = await postSchema.find();
    if(!findPost) {
        return res.status(400).json({message: "post not found"})
    }
     res.status(200).json({message:" post retrieved ",findPost})
    }
    catch(error){
        return res.status(500).json({message: "Internal server error"})
    }
}

exports.updatePost = async (req, res) => {
    const {postid } = req.params;
    try {
        const updateData = req.body;
        const myPost = await postSchema.findById(postid);
        if (!myPost) {
            return res.status(404).json({ message: "post not found" });
        }
        if (req.file) {
            updateData.media = {
                path: req.file.path
            };
            if (myPost.media && myPost.media.path) {
                await fs.unlink(myPost.media.path);
            }
        }
        Object.assign(myPost, updateData);
        const result = await myPost.save();
        res.status(200).json({ message: "post updated successfully", result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
      const findPost = await postSchema.findById(id);
      if (!findPost) {
        return res.status(404).json({ message: "No post found" });
      }
      await postSchema.findByIdAndDelete(id); 
      return res
        .status(200)
        .json({ message: "post removed successfully!!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };