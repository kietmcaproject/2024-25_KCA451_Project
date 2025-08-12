// const mongoose = require('mongoose')

// const userSchema =  new mongoose.Schema({
//     name : {
//         type : String,
//         required : [true, "provide name"]
//     },
//     email : {
//         type : String,
//         required : [true,"provide email"],
//         unique : true
//     },
//     password : {
//         type : String,
//         required : [true, "provide password"]
//     },
//     profile_pic : {
//         type : String,
//         default : ""
//     }
// },{
//     timestamps : true
// })

// const UserModel = mongoose.model('User',userSchema)

// module.exports = UserModel



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Google accounts may not provide this explicitly
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google users
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allows multiple users to have null googleId
  },
  profile_pic: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
