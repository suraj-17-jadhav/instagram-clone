const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const router = express.Router();
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");

// api to get profile on different users
router.get("/user/:id",(req,res)=>{
    USER.findOne({_id: req.params.id})
    .select("-password")
    .then(user=>{
        POST.find({postedBy: req.params.id})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.status(200).json({user, post})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not Found"})
    })
})

// APi to follow the user
router.put("/follow",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        USER.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).then(result=> res.json(result))
        .catch(err=> {return res.status(422).json({error:err})})
    })
})

// API to unfollow the  user
router.put("/unfollow",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.body.followId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        USER.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.followId}
        },{
            new:true
        }).then(result=> res.json(result))
        .catch(err=> {return res.status(422).json({error:err})})
    })
})

// api to upload profile pic
router.put("/uploadProfilePic",requireLogin,(req,res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{ Photo:req.body.pic}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
           return  res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })
})







module.exports=router;