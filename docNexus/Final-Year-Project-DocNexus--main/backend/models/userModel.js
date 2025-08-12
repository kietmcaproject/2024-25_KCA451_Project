import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbeautiful%2F&psig=AOvVaw3IAwcjEZJsD_oSsEuaIKdB&ust=1740723906358000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLjn3IGc44sDFQAAAAAdAAAAABAE" },
    address: { type: Object, default:{line1:'',line2:''} },
    gender: { type: String, default:"Not selected" },
    dob: { type: String, default:"Not selected" },
    phone: { type: String, default:"000000000" },
  }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
