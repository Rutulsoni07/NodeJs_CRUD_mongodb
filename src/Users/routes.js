const express = require("express");
const user = require("./controllers");

const routes = express.Router();

//read
routes.get("/", user.getAll);

//2. read one-
routes.get("/:id", user.getOne);

//4. update-
routes.put("/:id", user.updateOne);

//5. delete-
routes.delete("/:id", user.deleteOne);

module.exports = routes;
