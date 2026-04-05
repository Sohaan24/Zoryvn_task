
const authorizeRoles = (...allowedRoles)=> {
    return (req,res,next)=> {
        if(!req.user) {
            return res.status(401).json({error : "User not found Please Login "}) ;
        }

        if(!(allowedRoles.includes(req.user.role))) {
            return res.status(403).json({error : "Your role not exist"}) ;
        }

        next() ;
    }
}

module.exports = authorizeRoles ;