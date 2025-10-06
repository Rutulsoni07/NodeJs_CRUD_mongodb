const mongoose = require("mongoose");
const {USERROLE} = require("./const")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique username"],
    unique: [true, "username already exists"],
  },
  password: { type: String, unique: false, required: true },
  email: { type: String, required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  role: {
    type: Number,
    enum: [USERROLE.SELLER, USERROLE.BUYER, USERROLE.ADMIN],
    default: USERROLE.BUYER,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
