const Product = require("./models");

const getAll = async (req, res) => {
  try {
    const products = await Product.find();
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
    const id = req.params["id"];
    const Product = await Product.findOne({ _id: id });
    if (!Product) return res.json({ msg: "Product not found" });
    return res.status(200).json({ data: Product });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error,
    });
  }
};


const createOne = async (req, res) => {
  try {
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
      instock, // Optional (default is true in schema)
      discount, // Optional (default is 1 in schema)
    });

    res.status(201).json({ msg: "Product created", data: product });
  } catch (error) {
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

    await user.findOneAndUpdate(
      { _id: id },
      { products, price, desc, category, brand, discount, instock }
    );

    res.json({ msg: "user updated successfully!" });
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
