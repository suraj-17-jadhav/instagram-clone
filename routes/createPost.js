const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const router = express.Router();
const POST = mongoose.model("POST");

// Route
router.get("/allposts", requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  console.log(pic);
  if (!body || !pic) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  console.log(req.user);
  const post = new POST({
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/myposts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((myposts) => {
      res.json(myposts);
    });
});

router.put("/like", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name Photo")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name Photo")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name Photo")
    .populate("postedBy", "_id name")
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  //console.log(req.params.postId);
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      //console.log(post)
      if (err || !post) {
        return res.status(422).json({ error: err });
      }

      //console.log(post.postedBy._id.toString(),req.user._id.toString())

      if (post.postedBy._id.toString() == req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            return res.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

// to show following post
router.get("/myfollowingpost",requireLogin, (req,res)=>{
   POST.find({postedBy:{$in:req.user.following}})
   .populate("postedBy","_id name")
   .populate("comments.postedBy", "_id name")
   .then(posts =>{
       res.json(posts)
   })
   .catch(err =>{console.log(err)})
})



module.exports = router;
