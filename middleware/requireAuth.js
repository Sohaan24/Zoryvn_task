const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const requireAuth = async(req,res,next)=> {
    const {authorization} = req.headers ;

    if(!authorization) {
        return res.status(401).json({error : "Authorization token is required"}) ;
    }

    const token = authorization.split(" ")[1] ;

    try {
        const decodeToken = jwt.verify(token, process.env.JWT_secret) ;

        req.user = await User.findById(decodeToken.id).select("_id role") ;

        if (!req.user) {
            return res.status(401).json({ error: "User no longer exists" });
        }

        next();
    }
    catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ error: "Request is not authorized or token expired" });
    }

}

module.exports = requireAuth;