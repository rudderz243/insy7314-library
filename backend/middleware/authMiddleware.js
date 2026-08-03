const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

// validate the user authentication token
const validateAuth = async (req, res, next) => {
    let token;

    // checks for the presence of the token
    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                
                // try and find the user associated with that token
                req.user = await User.findById(decoded.id).select("-password");
                // check whether a user was found using that token
                if (!req.user) {
                    return res.status(401).json({message: "Requesting user no longer exists"});
                }
            }
        }
}