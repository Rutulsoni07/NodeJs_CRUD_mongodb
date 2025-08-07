const express = require("express");
const products = require("./controllers");

const routes = express.Router();

//read
routes.get("/getall_products", products.getAll);

//2. read one-
routes.get("/:index", products.getOne);

//3.create-
routes.post("/create_product", products.createOne);

//4. update-
routes.put("/update_product/:index", products.updateOne);

//5. delete-
routes.delete("/:index", products.deleteOne);

module.exports = routes;
