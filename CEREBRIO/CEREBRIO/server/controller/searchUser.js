// const UserModel = require('../models/UserModel')

// async function searchUser(request,response){
//     try {
//         const { search } = request.body

//         const query = new RegExp(search,"i","g")

//         const user = await UserModel.find({
//             "$or" : [
//                 { name : query },
//                 { email : query }
//             ]
//         }).select("-password")

//         return response.json({
//             message : 'all user',
//             data : user,
//             success : true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true
//         })
//     }
// }

// module.exports = searchUser



// const UserModel = require('../models/UserModel');

// async function searchUser(request, response) {
//     try {
//         const { search } = request.body;

//         // Create a case-insensitive regex to search for the email
//         const query = new RegExp(search, "i");  // The "g" flag is not needed here, just "i" for case insensitivity

//         // Search only by email
//         const user = await UserModel.find({
//             email: query  // Only search by email field
//         }).select("-password");  // Exclude password from the result

//         return response.json({
//             message: 'User found',
//             data: user,
//             success: true
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true
//         });
//     }
// }

// module.exports = searchUser;

const UserModel = require('../models/UserModel');

async function searchUser(request, response) {
    try {
        const { search } = request.body;

        if (!search || typeof search !== 'string' || search.trim() === '') {
            return response.status(400).json({
                message: 'Search term is required',
                success: false,
                data: [],
            });
        }

        const searchQuery = new RegExp(search.trim(), "i"); // Case-insensitive regex

        const users = await UserModel.find({
            $or: [
                { email: searchQuery },
                { name: searchQuery }
            ]
        }).select("-password");

        if (!users.length) {
            return response.status(200).json({
                message: 'No user found',
                data: [],
                success: true
            });
        }

        return response.status(200).json({
            message: 'User(s) found',
            data: users,
            success: true
        });

    } catch (error) {
        console.error('Search user error:', error);
        return response.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            success: false
        });
    }
}

module.exports = searchUser;

