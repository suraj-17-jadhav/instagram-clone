const express=require ('express');
const app=express();
const port=process.env.port || 5000;
const mongoose=require("mongoose");
const {mongoUrl}=require("./Keys.js");
const cors=require("cors");
const path=require("path");

app.use(cors());
require("./models/post.js"); 
require("./models/model.js");
app.use(express.json());
app.use(require("./routes/auth.js"));
app.use(require("./routes/createPost.js"))
app.use(require("./routes/user.js"));
mongoose.connect(mongoUrl);

mongoose.connection.on("connected",()=>{
   console.log("successfully connected to mongoDb");
})

mongoose.connection.on("error",()=>{
   console.log("not connected to mongo");
})

// serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")))
app.get("*" ,(req,res)=>{
   res.sendFile(
      path.join(__dirname, "./frontend/build/index.html"),
      function(err){
         res.status(500).send(err)
      }
   )
})


app.listen(9000);

app.listen(port,()=>{
   console.log("server is runnning on port "+ port);
})