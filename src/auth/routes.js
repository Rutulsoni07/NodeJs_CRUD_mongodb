const express = require("express");
const { register, login, logout } = require("./controler");


const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);

module.exports = routes;
