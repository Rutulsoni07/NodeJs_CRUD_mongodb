const Product = require("./models");
const User = require("../Users/models");
const upload = require("../config/multerconfig")
const fs = require('fs')

const getAll = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "username email -__v"); 
    console.log(req.cookies.count);

     if (!products || products.length === 0) {
       return res.status(404).json({ msg: "No Products Found" });
     }

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
    // console.log("req.body:", req.body);
    // console.log("req file:", req.file);

    const user_id = req.user.id; //get id 
      let imagePath = "";
      if (req.file) {
        imagePath = "/image/" + req.file.filename; // save only relative path
      }

    const user = await User.findById(user_id); // create id


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
      user:user_id,
      image:imagePath
    });
    user.products.push(product.id);
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
    const id = req.params.index;
    const product = await Product.findbyId(id);

    const { products, price, desc, category, brand, discount, instock } =
      req.body;
    if (!products || !price || !category || !instock)
      return res.status(400).json({ msg: "data required!!" });

   const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      { products, price, desc, category, brand, discount, instock }
    );

    
    let file = Public.Image;
    let oldfile = "";
    if (req.file?.filename) {
      oldfile = file;
      file = req.file.filename;
    }

     if (!updateProduct) return res.json({ msg: "Product not found" });
     res.json({ msg: "Product updated successfully", data: updateProduct });

     if (oldfile) {
       file_path = path_join(
         __dirname,
         "..",
         "..",
         "Public",
         "Images",
         Public.Images
       );
     }
  } catch (error) {
    return res.status(500).json({
      msg: "Server Not Found",
      error: error,
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Product.findbyIdAndDelete(id);

    if(!result) return res.status(404).json({msg:"product not found"})

      let file_path = ''
      if(result.image){
      const file_path = path.join(__dirname,"..","..","public","products",result.image)
      }
     
      // await Product.findbyIdAndDelete(id)

      if(result.image){
        fs.unlinkSync(file_path)
      }

    res.status(200).json({ msg: "Product deleted successfully!" });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Not Found",
      error: error,
    });
  }
};

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
