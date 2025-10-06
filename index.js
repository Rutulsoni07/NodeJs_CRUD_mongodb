require("dotenv").config(); // ✅ load .env first

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const app = express();
const port = 8000;

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Session setup
app.use(
  session({
    secret: "put_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: "lax" },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/Demo",
      collectionName: "sessions",
    }),
  })
);

// ✅ Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ✅ Google OAuth strategy (place this RIGHT HERE)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// ✅ Serialize & deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ✅ Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/fail",
  })
);

// ✅ Auth middleware
const isAuth = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    if (!req.session?.user)
      return res.status(401).json({ msg: "authentication required" });
    req.user = req.session.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// ✅ Protected & other routes
app.use("/dashboard", isAuth, (req, res) => {
  console.log(req.user);
  res.send("dashboard");
});

app.use("/fail", (req, res) => {
  res.send("authentication is fail, try again");
});

app.use(express.static(path.join(__dirname, "public")));
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
