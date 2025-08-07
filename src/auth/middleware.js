const isAuth = (req, res, next) => {
  try {
    if(!req.session.user )return res.status(401).json({
      msg:"authentication required"
    })
    req.user = req.session.user
    next()
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg:"Internal Sever Error",
      error:error
    })
    
  }
};
module.exports = {isAuth}
