const passport = require("passport")

module.exports = (roles=[]) => [
  passport.authenticate("jwt", { session:false }),
  (req,res,next)=>{
    if(roles.length && !roles.includes(req.user.role)){
      return res.status(403).json({error:"No autorizado"})
    }
    next()
  }
]