const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  products: { type: String, required: true },
  price: { type: Number, required: true, min:[0] },
  desc: { type: String },
  category: { type: String },
  brand: { type: String },
  instock: { type: Boolean, default: true },
  discount: { type: Number, default: 1 },
});

const Products = mongoose.model("product", Userschema);

module.exports = Products;
