const User=require('../models/User')
const jwt=require('jsonwebtoken')

async function authProtectMiddleware(req,res,next){
    let token;
      if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; 
  } else if (req.cookies?.token) {
    token = req.cookies.token;                
  }

    if(!token) return res.status(401).send({message:"Please Login In First"})
  try{
        const decode=jwt.verify(token, process.env.JWT_SECRET)
        req.user= await User.findById(decode.id)
        next()
    }catch(err){
      
        return res.status(401).send({message:"Invalid Token"})
    }

}


module.exports={
    authProtectMiddleware
}