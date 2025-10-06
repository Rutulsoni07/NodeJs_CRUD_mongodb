const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  products: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: [0] },
  desc: { type: String },
  category: {
    type: String,
  },
  brand: { type: String },
  instock: { type: Boolean, default: true },
  discount: { type: Number, default: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  image:{type:String}
  
});

const Products = mongoose.model("Product", productschema);

module.exports = Products;

