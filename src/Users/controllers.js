const product = require("../products/models");
const Users = require("./models");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  try {
    const users = await Users.find()
      .select("-password")
      .populate("products", "name price"); // ✅ fix here

    const result = users.map((user) => ({
      id: user._id,
      username: user.username,
      password:user.password,
      email: user.email,
      totalProducts: user.products.length,
      products: user.products,
    }));

    return res.status(201).json({
      users: result,
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
    const user = await Users.findOne({ _id: id });
    if (!user) return res.json({ msg: "data not found" });

    return res.json({ user: user, msg: "user" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error,
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const id = req.params["id"];
    const user = await Users.findById(id);

      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
        new: true,
      });

    if (!updatedUser) return res.json({ msg: "user not found" });

    const { username, password, email } = req.body;

    await Users.findOneAndUpdate({ _id: id }, { username, password, email });
    res.json({ msg: "user updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error,
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params["id"];
    const result = await Users.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ msg: "User Not Found" });
    res.json({ msg: "user deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error,
    });
  }
};

module.exports = { getAll, getOne, updateOne, deleteOne };
