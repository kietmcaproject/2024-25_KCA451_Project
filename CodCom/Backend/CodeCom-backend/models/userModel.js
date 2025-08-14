import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: Number },
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    createdCommunities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    ],
    lastLogin: { type: String, default: Date.now() },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
