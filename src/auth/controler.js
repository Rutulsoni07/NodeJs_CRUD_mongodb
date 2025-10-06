const Users = require("../Users/models");
const { USERROLE } = require("../Users/const");
const bcrypt = require("bcrypt");
const saltRounds = process.env.bycrypt_solt;
const OTP_STORE = {};
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (role === USERROLE.ADMIN && req.session.user?.role !== USERROLE.ADMIN) {
      return res
        .status(404)
        .json({ msg: "Only admins can create another admin" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await Users.create({
      username,
      password: hashedPassword,
      email,
      role
    });

    return res.status(201).json({
      msg: "User Registered",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
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

    // const isPasswordOk = bcrypt.compareSync(password, user.password);
    // if (!isPasswordOk) return res.status(401).json({ msg: "password Wrong" });

    // if (user.password !== password)
    //   return res.status(401).json({ msg: "please fill the correct password" });

     const token = jwt.sign(
       {
         id: user._id,
         userName: user.username,
         email: user.email,
       },
       process.env.JWT_SECRET,
       { expiresIn: "2h" }
     );

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({ msg: "login successfully", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  const user_Id = req.user.id;

  const { password, new_password } = req.body;
  if (!password || !new_password)
    return res.json({ msg: "Password & New Password required" });

  const user = await Users.findById(user_Id);
  if (!user) return res.status(404).json({ msg: "user not found" });

  const Match_password = bcrypt.compareSync(password, user.password);
  if (!Match_password) return res.json({ msg: "please correct password " });

user.password = bcrypt.hashSync(new_password, saltRounds);
  await user.save();
  res.json({
    msg: "password Update Successfully",
  });
};

const send_OTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ msg: "email require" });

    const is_USER = await Users.exists({ email: email });
    if (!is_USER) return res.json({ msg: "not vaild Email_id" });

    function generateOTP(length = 6) {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    }

    const otp = generateOTP(6);

    OTP_STORE[email] = { otp: otp, Verified: false };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    return res.json({
      msg: "EMAIL sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to send OTP" });
  }
};

const verified_OTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email) return res.json({ msg: "email require....!!!! " });
  if (OTP_STORE[email]["otp"] !== otp) return res.json({ msg: "wrong OTP" });

  OTP_STORE[email]["isVerified"] = true;
  res.json({ msg: "OTP verified successfully!" });
};

const forgotpassword = async (req, res) => {
  const { email, password, again_Password } = req.body;

  if (!OTP_STORE[email]?.Verified)
    return res.json({ msg: "you can not change password" });
  if (password != again_Password)
    return res.json({ msg: "password does not match" });

  const user = await Users.findOne({ email: email });
  if (!user) return res.status(404).json({ msg: "user not found" });

  user.password = bcrypt.hashSync(password, saltRounds);

  await user.save();

  delete OTP_STORE[email];
  res.json({ msg: " password update successfully" });
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

module.exports = { register, login, logout, forgotpassword, resetPassword,verified_OTP,send_OTP };
