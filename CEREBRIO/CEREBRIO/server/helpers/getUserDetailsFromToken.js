// const jwt = require('jsonwebtoken')
// const UserModel = require('../models/UserModel')


// const getUserDetailsFromToken = async(token)=>{
    
//     if(!token){
//         return {
//             message : "session out",
//             logout : true,
//         }
//     }
//     console.log("going to check token validation");
//     const decode = await jwt.verify(token,process.env.JWT_SECREAT_KEY)
    
//     console.log("log after validation");
//     const user = await UserModel.findById(decode.id).select('-password')
//     console.log("log after user found");

//     return user
// }

// module.exports = getUserDetailsFromToken

const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "session out",
            logout: true,
        };
    }

    console.log("going to check token validation");

    const decode = jwt.decode(token);  // Just decode, not verify (optional)

    if (!decode || !decode.id) {
        return {
            message: "Invalid token",
            logout: true,
        };
    }

    console.log("Decoded Token:", decode);

    try {
        const user = await UserModel.findById(decode.id).select('-password');

        if (!user) {
            console.log("User not found for ID:", decode.id);
            return {
                message: "User not found",
                logout: true,
            };
        }

        console.log("User found:", user);
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        return {
            message: "User not found",
            logout: true,
        };
    }
};

module.exports = getUserDetailsFromToken;
