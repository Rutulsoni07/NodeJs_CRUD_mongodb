const express = require("express");
const products = require("./controllers");
const { isAuth } = require("../auth/middleware");

const routes = express.Router();

//read
routes.get("/getall_products", products.getAll);

//2. read one-
routes.get("/getone/:id", products.getOne);

//3.create-
routes.post("/create_product",  isAuth  ,products.createOne);

//4. update-
routes.put("/update_product/:index", products.updateOne);

//5. delete-
routes.delete("/delete_product", products.deleteOne);

module.exports = routes;
