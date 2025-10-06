const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    // if (!req.session?.user)
    //   return res.status(401).json({
    //     msg: "authentication required",
    //   });
    // req.user = req.session.user;

    
     console.log(req.headers.authorization); // object 
        const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        console.log(token)
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }
        const decodeddata = jwt.verify(token , process.env.JWT_SECRET, (err , decoded) =>{
            if(err) return res.status(401).json({msg :"Token is not valid"})
            req.user = decoded;
            console.log(decodeddata)
    next();
})
  } 
  
  catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Sever Error",
      error: error,
    });
  }
};
module.exports = { isAuth };
