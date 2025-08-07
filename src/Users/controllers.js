const Users = require("./models");

const getAll = async (req, res) => {
  try {
    const users = await Users.find();

    
    return res.status(201).json({
      users: users,
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
  } 
  catch (error) {
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
    if (!user) return res.json({ msg: "user not found" });

    const { username, password, email } = req.body;

    await Users.findOneAndUpdate(
      { _id: id },
      { username, password, email }
    );
    res.json({ msg: "user updated successfully!" });
  } 
    catch (error) {
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

    res.json({ msg: "user deleted successfully!" });
  }
    catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error,
    });
  }
};

module.exports = { getAll, getOne , updateOne, deleteOne };
