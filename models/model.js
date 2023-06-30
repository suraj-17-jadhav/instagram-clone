const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  Photo:{
    type:String,
  },
  followers: [{ type: ObjectId, ref: "USER" }],
  following: [{ type: ObjectId, ref: "USER" }],
});

mongoose.model("USER", userSchema);
