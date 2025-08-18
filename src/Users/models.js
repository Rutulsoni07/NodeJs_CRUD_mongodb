const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required:[true,"Please provide unique username"],
    unique:[true,"username already exists"]
  },
  password: {type: String,
    unique:false
  },
  email: {type:String,
    required:true,
    unique:true,
  },
  products: [{type: mongoose.Schema.Types.ObjectId, ref:"Products"}]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
