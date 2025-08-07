const Users = require("../Users/models");

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await Users.create({ username, password, email });
    return res.status(201).json({
      msg: "User Registered",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await Users.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) return res.status(404).json({ msg: "user not found" });

    if (user.password !== password)
      return res.status(401).json({ msg: "please fill the correct password" });

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({ msg: "login successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.json({ msg: "Logout successful" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { register, login, logout };
