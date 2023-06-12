const express = require('express');
const {PostModel} =require('../models/posts.model');
const {auth} = require('../middleware/auth.middleware');

const postRouter = express.Router();

postRouter.use(auth);

postRouter.post("/add", async(req,res) => {
    try{
        const post =new PostModel(req.body);
        await post.save();
        res.status(200).json({msg:"post has been added",post:req.body})
      } catch(err){
        res.status(400).json({error:err.message});
      }; 
});

postRouter.get("/", async(req,res) =>{
    try{
        const posts = await PostModel.find({userID:req.body.userID})
        res.status(200).send(posts)
    } catch(err){
      res.status(400).json({error:err.message});
    };
});

postRouter.get("/user", async (req, res) => {
    try {
      const { userId, minComments, maxComments } = req.query;
  
      const filters = { user: userId };
      if (minComments !== undefined && maxComments !== undefined) {
        filters.no_of_comments = { $gte: minComments, $lte: maxComments };
      }
  
      const posts = await PostModel.find(filters).limit(3);
  
      res.status(200).json({ posts });
    } catch (err) {
      res.status(400).json({ error:err.message});
    }
  });

  postRouter.get("/top", async (req, res) => {
    try {
      const userId = req.body.userId;

      const posts = await PostModel.find({ user: userId }).sort({ no_of_comments: -1 }).limit(3);
  
      res.status(200).json({ posts });
    } catch (err) {
      res.status(400).json({ error: err.message});
    }
  });

postRouter.patch("/update/:postID", async (req,res) =>{
    const userIDinUserDoc = req.body.userID;
    const {postID} = req.params;
    try {
     const post = await PostModel.findOne({_id:postID})
     const userIDinPostDoc = post.userID;
     if(userIDinUserDoc===userIDinPostDoc){
      await PostModel.findByIdAndUpdate({_id:postID},req.body);
      res.json({mag:`${post.title} has been updated`})
     }else{
      res.json({msg:"Not Authorized!!"})
     }
    } catch(err){
       res.json({error:err.message})
    };
    
 });
 
 postRouter.delete("/delete/:postID", async (req,res) =>{
    const userIDinUserDoc = req.body.userID;
    const {postID} = req.params;
    try {
     const post = await PostModel.findOne({_id:postID})
     const userIDinPostDoc = post.userID;
     if(userIDinUserDoc===userIDinPostDoc){
      await PostModel.findByIdAndDelete({_id:postID},req.body);
      res.json({mag:`${post.title} has been updated`})
     }else{
      res.json({msg:"Not Authorized!!"})
     }
    } catch(err){
       res.json({error:err.message})
    };
 });

module.exports = {
    postRouter
}