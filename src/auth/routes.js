const express = require("express");
const {
  register,
  login,
  logout,
  forgotpassword,
  resetPassword,
  verified_OTP,
  send_OTP,
} = require("./controler");

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);
routes.post("/forgetpassword", forgotpassword)
routes.post("/resetpassword",resetPassword)
routes.post("/verified_otp",verified_OTP)
routes.post("/send_otp",send_OTP)

module.exports = routes;
