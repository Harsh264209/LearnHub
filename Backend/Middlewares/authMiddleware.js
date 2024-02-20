




const JWT=require('jsonwebtoken')
const User=require('../Models/User')


const authenticateUser = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        console.log("Authenticated user:", req.user); // Log the authenticated user
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: "Unauthorized Access" });
    }
};


const isAdmin = async (req, res, next) => {
    try {
        console.log("User ID:", req.user.userId); // Access user ID consistently
        const user = await User.findById(req.user.userId);
        console.log("User:", user); // Log the user object returned from the database
        if (!user || user.role !== 'admin') {
            res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: "Unauthorized Access" });
    }
};


module.exports = { authenticateUser, isAdmin };
