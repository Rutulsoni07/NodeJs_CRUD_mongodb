// index.js

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express(); // ✅ Initialize app first

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: "put_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

const port = 8000;

// ✅ Routes (after app is defined)
app.use("/auth", require("./src/auth/routes"));
app.use("/users", require("./src/Users/routes"));
app.use("/products", require("./src/products/routes"));

// ✅ Start server after DB connection
app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Products", {
      autoIndex: false,
    });
    console.log("Db is connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
});
