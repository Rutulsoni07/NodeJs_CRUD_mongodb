const Product = require("./models");
const User = require("../Users/models");

const getAll = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email"); 
    console.log(req.cookies.count);

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error,
    });
  }
};


const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id)
       .populate("user", "name email"); 
    if (!product) return res.status(404).json({ msg: "Product not found" });
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
const createOne = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req file:", req.file);

    const user_id = req.user.id;
    // console.log(user_id);

    const user = await User.findById(user_id);

    const { products, price, desc, category, brand, instock, discount } =
      req.body;

    if (!products || !price || !category)
      return res
        .status(400)
        .json({ msg: "Required fields: products, price, category" });

    const product = await Product.create({
      products,
      price,
      desc,
      category,
      brand,
      instock,
      discount,
      user:user_id
    });
    User.product.push(product._id)
    await user.save()

    res.status(201).json({ msg: "Product created", data: product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const id = req.params["id"];
    const product = await Product.findbyId(id);

    const { products, price, desc, category, brand, discount, instock } =
      req.body;
    if (!products || !price || !category || !instock)
      return res.status(400).json({ msg: "data required!!" });

    await Product.findOneAndUpdate(
      { _id: id },
      { products, price, desc, category, brand, discount, instock }
    );

    res.json({ msg: "Product updated successfully!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Server Not Found",
      error: error,
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params["id"];

    const result = await Product.findbyIdAndDelete(id);

    res.json({ msg: "Product deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Not Found",
      error: error,
    });
  }
};

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
